package com.chirru.portfolio.controller;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequiredArgsConstructor
public class PublicResumeController {
    private static final Logger log = LoggerFactory.getLogger(PublicResumeController.class);

    private final JdbcTemplate jdbc;
    private final com.chirru.portfolio.service.MediaService mediaService;
    private final RestClient restClient = RestClient.builder().build();

    @GetMapping("/portfolio/resume")
    public ResponseEntity<byte[]> resume() {
        Optional<ResumeAsset> maybeResume = activeResume()
                .or(this::profileResume)
                .or(this::fallbackMediaResume);

        if (maybeResume.isEmpty()) {
            log.warn("No resume asset configured or found in database");
            return ResponseEntity.notFound().build();
        }

        String url = maybeResume.get().url();
        String filename = maybeResume.get().filename();
        String mimeType = maybeResume.get().mimeType();

        if (url != null && (url.contains("/media/") || (!url.startsWith("http://") && !url.startsWith("https://")))) {
            var mediaIdOpt = mediaService.findIdByPublicIdOrUrl(null, url);
            if (mediaIdOpt.isPresent()) {
                Optional<ResumeAsset> asset = fetchFromMediaAssets(mediaIdOpt.get());
                if (asset.isPresent()) {
                    url = asset.get().url();
                    if (filename == null || filename.isBlank()) filename = asset.get().filename();
                    if (mimeType == null || mimeType.isBlank()) mimeType = asset.get().mimeType();
                }
            }
        }

        if (url == null || url.isBlank() || (!url.startsWith("http://") && !url.startsWith("https://"))) {
            return ResponseEntity.notFound().build();
        }

        try {
            ResponseEntity<byte[]> upstream = restClient.get()
                    .uri(url)
                    .retrieve()
                    .toEntity(byte[].class);

            byte[] body = upstream.getBody();
            if (body == null || body.length == 0) {
                return ResponseEntity.notFound().build();
            }

            MediaType contentType = upstream.getHeaders().getContentType();
            if (contentType == null || contentType.equals(MediaType.APPLICATION_OCTET_STREAM)) {
                contentType = mimeType == null || mimeType.isBlank()
                        ? MediaType.APPLICATION_OCTET_STREAM
                        : MediaType.parseMediaType(mimeType);
            }

            String downloadName = filename == null || filename.isBlank()
                    ? "resume.pdf"
                    : filename;

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + downloadName.replace("\"", "") + "\"")
                    .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePublic())
                    .header(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*")
                    .body(body);
        } catch (Exception e) {
            log.warn("Failed to stream resume PDF from URL {}: {}", url, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private Optional<ResumeAsset> activeResume() {
        return jdbc.query("""
                SELECT COALESCE(m.url, r.url) AS url, COALESCE(m.original_filename, 'resume.pdf') AS original_filename, m.mime_type
                FROM resume_versions r
                LEFT JOIN media_assets m ON m.public_id = r.public_id
                WHERE r.active=true AND NULLIF(TRIM(r.url),'') IS NOT NULL
                ORDER BY r.created_at DESC LIMIT 1
                """,
                rs -> rs.next() ? Optional.of(new ResumeAsset(
                        rs.getString("url"), rs.getString("original_filename"), rs.getString("mime_type"))) : Optional.empty());
    }

    private Optional<ResumeAsset> profileResume() {
        return jdbc.query("""
                SELECT resume_url, resume_public_id
                FROM profile
                ORDER BY updated_at DESC LIMIT 1
                """,
                rs -> {
                    if (!rs.next()) return Optional.empty();
                    String resumeUrl = rs.getString("resume_url");
                    String resumePublicId = rs.getString("resume_public_id");

                    Optional<Long> idOpt = mediaService.findIdByPublicIdOrUrl(resumePublicId, resumeUrl);
                    if (idOpt.isPresent()) {
                        Optional<ResumeAsset> fromMedia = fetchFromMediaAssets(idOpt.get());
                        if (fromMedia.isPresent()) return fromMedia;
                    }

                    if (resumePublicId != null && !resumePublicId.isBlank()) {
                        Optional<ResumeAsset> byPublicId = jdbc.query(
                                "SELECT url, original_filename, mime_type FROM media_assets WHERE public_id = ?",
                                ps -> ps.setString(1, resumePublicId),
                                r -> r.next() ? Optional.of(new ResumeAsset(r.getString("url"), r.getString("original_filename"), r.getString("mime_type"))) : Optional.empty());
                        if (byPublicId.isPresent()) return byPublicId;
                    }

                    if (resumeUrl != null && !resumeUrl.isBlank() && (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://"))) {
                        return Optional.of(new ResumeAsset(resumeUrl, "resume.pdf", "application/pdf"));
                    }
                    return Optional.empty();
                });
    }

    private Optional<ResumeAsset> fallbackMediaResume() {
        return jdbc.query("""
                SELECT url, original_filename, mime_type
                FROM media_assets
                WHERE folder = 'resume' OR mime_type = 'application/pdf' OR public_id ILIKE '%resume%' OR original_filename ILIKE '%.pdf'
                ORDER BY id DESC LIMIT 1
                """,
                rs -> rs.next() ? Optional.of(new ResumeAsset(
                        rs.getString("url"), rs.getString("original_filename"), rs.getString("mime_type"))) : Optional.empty());
    }

    private Optional<ResumeAsset> fetchFromMediaAssets(long id) {
        return jdbc.query(
                "SELECT url, original_filename, mime_type FROM media_assets WHERE id = ?",
                ps -> ps.setLong(1, id),
                rs -> rs.next() ? Optional.of(new ResumeAsset(
                        rs.getString("url"), rs.getString("original_filename"), rs.getString("mime_type"))) : Optional.empty());
    }

    private record ResumeAsset(String url, String filename, String mimeType) {}
}
