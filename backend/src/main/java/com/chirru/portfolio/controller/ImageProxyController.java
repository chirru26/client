package com.chirru.portfolio.controller;

import com.chirru.portfolio.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/media")
@RequiredArgsConstructor
public class ImageProxyController {
    private static final Logger log = LoggerFactory.getLogger(ImageProxyController.class);
    private static final long MAX_MEDIA_BYTES = 10L * 1024 * 1024;

    private final MediaService mediaService;
    private final Map<Long, CachedMedia> cache = new ConcurrentHashMap<>();

    private final RestClient restClient = RestClient.builder()
            .requestFactory(createRequestFactory())
            .build();

    private static SimpleClientHttpRequestFactory createRequestFactory() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(6));
        factory.setReadTimeout(Duration.ofSeconds(12));
        return factory;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void warmCache() {
        CompletableFuture.runAsync(() -> {
            for (long id : new long[]{1, 2, 5, 7}) {
                try {
                    proxyMedia(id);
                } catch (Exception ignored) {}
            }
        });
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<byte[]> proxyMedia(@PathVariable long id) {
        CachedMedia cached = cache.get(id);
        if (cached != null) {
            return ResponseEntity.ok()
                    .contentType(cached.contentType)
                    .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS).cachePublic())
                    .header("X-Content-Type-Options", "nosniff")
                    .body(cached.data);
        }

        Optional<MediaService.MediaAsset> asset = mediaService.findById(id);
        if (asset.isEmpty()) return ResponseEntity.notFound().build();

        MediaService.MediaAsset media = asset.get();
        if (!isAllowedCloudinaryDeliveryUrl(media.url())) {
            log.warn("Blocked media asset {} with untrusted storage URL", id);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            ResponseEntity<byte[]> upstream = restClient.get().uri(media.url()).retrieve().toEntity(byte[].class);
            byte[] body = upstream.getBody();
            if (body == null || body.length == 0) return ResponseEntity.notFound().build();
            if (body.length > MAX_MEDIA_BYTES) return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).build();

            MediaType contentType = upstream.getHeaders().getContentType();
            if (contentType == null || MediaType.APPLICATION_OCTET_STREAM.equals(contentType)) {
                try {
                    contentType = media.mimeType() == null || media.mimeType().isBlank()
                            ? MediaType.APPLICATION_OCTET_STREAM
                            : MediaType.parseMediaType(media.mimeType());
                } catch (Exception ignored) {
                    contentType = MediaType.APPLICATION_OCTET_STREAM;
                }
            }

            cache.put(id, new CachedMedia(body, contentType));

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .cacheControl(CacheControl.maxAge(24, TimeUnit.HOURS).cachePublic())
                    .header("X-Content-Type-Options", "nosniff")
                    .body(body);
        } catch (Exception e) {
            log.warn("Failed to proxy media asset {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    public void evictCache(long id) {
        cache.remove(id);
    }

    private boolean isAllowedCloudinaryDeliveryUrl(String url) {
        return url != null && url.startsWith("https://res.cloudinary.com/");
    }

    public record CachedMedia(byte[] data, MediaType contentType) {}
}
