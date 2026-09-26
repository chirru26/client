package com.chirru.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MediaService {
    private final JdbcTemplate jdbc;

    public Optional<MediaAsset> findById(long id) {
        return jdbc.query(
                "SELECT id, url, mime_type FROM media_assets WHERE id=?",
                ps -> ps.setLong(1, id),
                rs -> rs.next() ? Optional.of(new MediaAsset(rs.getLong("id"), rs.getString("url"), rs.getString("mime_type"))) : Optional.empty());
    }

    public Optional<Long> findIdByPublicId(String publicId) {
        if (publicId == null || publicId.isBlank()) return Optional.empty();
        return jdbc.query(
                "SELECT id FROM media_assets WHERE public_id=?",
                ps -> ps.setString(1, publicId),
                rs -> rs.next() ? Optional.of(rs.getLong("id")) : Optional.empty());
    }

    private Optional<Long> extractMediaId(String str) {
        if (str == null || str.isBlank()) return Optional.empty();
        if (str.startsWith("/api/v2/media/")) {
            try {
                return Optional.of(Long.parseLong(str.substring("/api/v2/media/".length())));
            } catch (NumberFormatException ignored) {}
        }
        if (str.startsWith("/media/")) {
            try {
                return Optional.of(Long.parseLong(str.substring("/media/".length())));
            } catch (NumberFormatException ignored) {}
        }
        if (str.matches("^\\d+$")) {
            try {
                return Optional.of(Long.parseLong(str));
            } catch (NumberFormatException ignored) {}
        }
        return Optional.empty();
    }

    public Optional<Long> findIdByPublicIdOrUrl(String publicId, String url) {
        var idFromPublicId = extractMediaId(publicId);
        if (idFromPublicId.isPresent() && findById(idFromPublicId.get()).isPresent()) {
            return idFromPublicId;
        }

        var idFromUrl = extractMediaId(url);
        if (idFromUrl.isPresent() && findById(idFromUrl.get()).isPresent()) {
            return idFromUrl;
        }

        if (publicId != null && !publicId.isBlank()) {
            var byPublicId = findIdByPublicId(publicId);
            if (byPublicId.isPresent()) return byPublicId;
        }
        if (url != null && !url.isBlank()) {
            return jdbc.query(
                    "SELECT id FROM media_assets WHERE url=?",
                    ps -> ps.setString(1, url),
                    rs -> rs.next() ? Optional.of(rs.getLong("id")) : Optional.empty());
        }
        return Optional.empty();
    }

    public String resolveMediaUrl(String publicId, String url) {
        return findIdByPublicIdOrUrl(publicId, url)
                .map(this::publicUrl)
                .orElse(url);
    }

    public String publicUrl(long id) { return "/api/v2/media/" + id; }

    public String publicUrlForPublicId(String publicId, String fallback) {
        return findIdByPublicId(publicId).map(this::publicUrl).orElse(fallback);
    }

    public record MediaAsset(long id, String url, String mimeType) {}
}
