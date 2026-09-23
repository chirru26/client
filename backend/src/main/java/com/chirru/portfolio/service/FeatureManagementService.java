package com.chirru.portfolio.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FeatureManagementService {
    private final JdbcTemplate jdbc;

    public List<Map<String, Object>> settings() {
        return jdbc
                .queryForList("SELECT setting_key, setting_value, updated_at FROM site_settings ORDER BY setting_key");
    }

    @Transactional
    public void setSetting(String key, String value) {
        jdbc.update(
                "INSERT INTO site_settings(setting_key,setting_value) VALUES (?,?) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value, updated_at=CURRENT_TIMESTAMP",
                key, value);
    }

    public List<Map<String, Object>> socialLinks(boolean visibleOnly) {
        String sql = "SELECT id, platform, label, url, icon, display_order, visible, created_at, updated_at FROM social_links"
                + (visibleOnly ? " WHERE visible=true" : "") + " ORDER BY display_order,id";
        return jdbc.queryForList(sql);
    }

    public long saveSocial(Long id, String platform, String label, String url, String icon, Integer order,
            Boolean visible) {
        if (id == null) {
            var keys = new org.springframework.jdbc.support.GeneratedKeyHolder();
            jdbc.update(c -> {
                var ps = c.prepareStatement(
                        "INSERT INTO social_links(platform,label,url,icon,display_order,visible) VALUES (?,?,?,?,?,?)",
                        new String[] { "id" });
                ps.setString(1, platform);
                ps.setString(2, label);
                ps.setString(3, url);
                ps.setString(4, icon);
                ps.setInt(5, order == null ? 0 : order);
                ps.setBoolean(6, visible == null || visible);
                return ps;
            }, keys);
            return keys.getKey().longValue();
        }
        jdbc.update(
                "UPDATE social_links SET platform=?,label=?,url=?,icon=?,display_order=?,visible=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
                platform, label, url, icon, order == null ? 0 : order, visible == null || visible, id);
        return id;
    }

    public void deleteSocial(long id) {
        jdbc.update("DELETE FROM social_links WHERE id=?", id);
    }

    public Map<String, Object> seo(String pageKey) {
        List<Map<String, Object>> rows = jdbc.queryForList(
                "SELECT page_key,title,description,keywords,canonical_url,og_image_url,no_index,updated_at FROM seo_settings WHERE page_key=?",
                pageKey);
        if (!rows.isEmpty()) {
            return rows.get(0);
        }
        return Map.of(
                "page_key", pageKey,
                "title", "Chiranjit Das",
                "description", "Official portfolio of Chiranjit Das, Java & Backend Software Engineer.",
                "keywords", "Java, Spring Boot, Backend, PostgreSQL, REST APIs",
                "canonical_url", "/" + ("home".equalsIgnoreCase(pageKey) ? "" : pageKey),
                "og_image_url", "/og-image.jpg",
                "no_index", false
        );
    }

    @Transactional
    public void saveSeo(String pageKey, String title, String description, String keywords, String canonical,
            String ogImage, Boolean noIndex) {
        jdbc.update(
                "INSERT INTO seo_settings(page_key,title,description,keywords,canonical_url,og_image_url,no_index) VALUES (?,?,?,?,?,?,?) ON CONFLICT(page_key) DO UPDATE SET title=EXCLUDED.title,description=EXCLUDED.description,keywords=EXCLUDED.keywords,canonical_url=EXCLUDED.canonical_url,og_image_url=EXCLUDED.og_image_url,no_index=EXCLUDED.no_index,updated_at=CURRENT_TIMESTAMP",
                pageKey, title, description, keywords, canonical, ogImage, noIndex != null && noIndex);
    }

    // Technologies are intentionally name-only. No slug is required for a portfolio
    // technology chip.
    public List<Map<String, Object>> technologies() {
        return jdbc.queryForList("SELECT id,name,created_at FROM technologies ORDER BY name");
    }

    @Transactional
    public long saveTechnology(Long id, String name) {
        if (id == null) {
            var keys = new org.springframework.jdbc.support.GeneratedKeyHolder();
            jdbc.update(c -> {
                var ps = c.prepareStatement("INSERT INTO technologies(name) VALUES (?)", new String[] { "id" });
                ps.setString(1, name.trim());
                return ps;
            }, keys);
            return keys.getKey().longValue();
        }
        jdbc.update("UPDATE technologies SET name=? WHERE id=?", name.trim(), id);
        return id;
    }

    public void deleteTechnology(long id) {
        jdbc.update("DELETE FROM technologies WHERE id=?", id);
    }

    public void setProjectTechnologies(long projectId, List<Long> technologyIds) {
        jdbc.update("DELETE FROM project_technology_map WHERE project_id=?", projectId);
        if (technologyIds != null)
            for (Long technologyId : technologyIds)
                jdbc.update(
                        "INSERT INTO project_technology_map(project_id,technology_id) VALUES (?,?) ON CONFLICT DO NOTHING",
                        projectId, technologyId);
    }

    public List<Map<String, Object>> projectTechnologies(long projectId) {
        return jdbc.queryForList(
                "SELECT t.id,t.name FROM technologies t JOIN project_technology_map m ON m.technology_id=t.id WHERE m.project_id=? ORDER BY t.name",
                projectId);
    }

    public List<Map<String, Object>> media(String folder) {
        if (folder == null || folder.isBlank())
            return jdbc.queryForList("SELECT * FROM media_assets ORDER BY created_at DESC");
        return jdbc.queryForList("SELECT * FROM media_assets WHERE folder=? ORDER BY created_at DESC", folder);
    }

    public java.util.Optional<MediaReplacement> findMediaForReplacement(String folder, String filename) {
        String sql;
        Object[] args;
        if ("profile".equalsIgnoreCase(folder) || "resume".equalsIgnoreCase(folder)) {
            sql = "SELECT id, public_id, resource_type FROM media_assets WHERE folder=? ORDER BY created_at DESC LIMIT 1";
            args = new Object[] { folder };
        } else {
            sql = "SELECT id, public_id, resource_type FROM media_assets WHERE folder=? AND original_filename=? ORDER BY created_at DESC LIMIT 1";
            args = new Object[] { folder, filename };
        }
        return jdbc.query(sql, ps -> {
            for (int i = 0; i < args.length; i++) ps.setObject(i + 1, args[i]);
        }, rs -> rs.next()
                ? java.util.Optional.of(new MediaReplacement(rs.getLong("id"), rs.getString("public_id"), rs.getString("resource_type")))
                : java.util.Optional.empty());
    }

    public record MediaReplacement(long id, String publicId, String resourceType) {}

    public long saveMedia(String folder, String resourceType, String publicId, String url, String filename, String mime,
            Long bytes, Integer width, Integer height) {
        jdbc.update(
                "INSERT INTO media_assets(folder,resource_type,public_id,url,original_filename,mime_type,bytes,width,height) VALUES (?,?,?,?,?,?,?,?,?) ON CONFLICT(public_id) DO UPDATE SET url=EXCLUDED.url,original_filename=EXCLUDED.original_filename,mime_type=EXCLUDED.mime_type,bytes=EXCLUDED.bytes,width=EXCLUDED.width,height=EXCLUDED.height",
                folder, resourceType, publicId, url, filename, mime, bytes, width, height);
        return jdbc.queryForObject("SELECT id FROM media_assets WHERE public_id=?", Long.class, publicId);
    }

    public void deleteMedia(String publicId) {
        jdbc.update("DELETE FROM media_assets WHERE public_id=?", publicId);
    }

    public List<Map<String, Object>> resumes() {
        return jdbc.queryForList("SELECT * FROM resume_versions ORDER BY active DESC,created_at DESC");
    }

    @Transactional
    public long saveResume(Long id, String title, String url, String publicId, String version, Boolean active) {
        if (Boolean.TRUE.equals(active))
            jdbc.update("UPDATE resume_versions SET active=false");
        if (id == null) {
            var keys = new org.springframework.jdbc.support.GeneratedKeyHolder();
            jdbc.update(c -> {
                var ps = c.prepareStatement(
                        "INSERT INTO resume_versions(title,url,public_id,version_label,active) VALUES (?,?,?,?,?)",
                        new String[] { "id" });
                ps.setString(1, title);
                ps.setString(2, url);
                ps.setString(3, publicId);
                ps.setString(4, version);
                ps.setBoolean(5, Boolean.TRUE.equals(active));
                return ps;
            }, keys);
            return keys.getKey().longValue();
        }
        jdbc.update("UPDATE resume_versions SET title=?,url=?,public_id=?,version_label=?,active=? WHERE id=?", title,
                url, publicId, version, Boolean.TRUE.equals(active), id);
        return id;
    }

    public void deleteResume(long id) {
        jdbc.update("DELETE FROM resume_versions WHERE id=?", id);
    }

    @Transactional
    public void recordEvent(String type, String path, Long projectId, String referrer, String country, String device,
            String visitorHash) {
        jdbc.update(
                "INSERT INTO analytics_events(event_type,path,project_id,referrer,country,device,visitor_hash) VALUES (?,?,?,?,?,?,?)",
                type, path, projectId, referrer, country, device, visitorHash);
        if ("resume_download".equals(type))
            jdbc.update("UPDATE resume_versions SET download_count=download_count+1 WHERE active=true");
    }

    public Map<String, Object> dashboard() {
        return jdbc.queryForMap(
                "SELECT (SELECT COUNT(*) FROM analytics_events WHERE event_type='page_view') AS page_views,(SELECT COUNT(DISTINCT visitor_hash) FROM analytics_events WHERE visitor_hash IS NOT NULL) AS unique_visitors,(SELECT COUNT(*) FROM projects) AS projects,(SELECT COUNT(*) FROM messages WHERE read=false) AS unread_messages,(SELECT COALESCE(SUM(download_count),0) FROM resume_versions) AS resume_downloads,(SELECT COUNT(*) FROM analytics_events WHERE event_type='project_view') AS project_views");
    }

    public List<Map<String, Object>> analytics(int days) {
        return jdbc.queryForList(
                "SELECT DATE(created_at) day,event_type,COUNT(*) count FROM analytics_events WHERE created_at >= CURRENT_TIMESTAMP - (? * INTERVAL '1 day') GROUP BY DATE(created_at),event_type ORDER BY day DESC,event_type",
                days);
    }

    public List<Map<String, Object>> notifications(boolean unreadOnly) {
        String sql = "SELECT * FROM notifications" + (unreadOnly ? " WHERE read=false" : "")
                + " ORDER BY created_at DESC";
        return jdbc.queryForList(sql);
    }

    public long notification(String type, String title, String body, String link) {
        var keys = new org.springframework.jdbc.support.GeneratedKeyHolder();
        jdbc.update(c -> {
            var ps = c.prepareStatement("INSERT INTO notifications(type,title,body,link) VALUES (?,?,?,?)",
                    new String[] { "id" });
            ps.setString(1, type);
            ps.setString(2, title);
            ps.setString(3, body);
            ps.setString(4, link);
            return ps;
        }, keys);
        return keys.getKey().longValue();
    }

    public void markNotificationRead(long id) {
        jdbc.update("UPDATE notifications SET read=true WHERE id=?", id);
    }

    public List<Map<String, Object>> search(String q) {
        String like = "%" + q.toLowerCase() + "%";
        return jdbc.queryForList(
                "SELECT 'project' type,id,title AS name,description AS text FROM projects WHERE LOWER(title) LIKE ? OR LOWER(description) LIKE ? UNION ALL SELECT 'skill',id,name,COALESCE(category,'') FROM skills WHERE LOWER(name) LIKE ? OR LOWER(COALESCE(category,'')) LIKE ? UNION ALL SELECT 'experience',id,position,COALESCE(company,'') FROM experience WHERE LOWER(position) LIKE ? OR LOWER(company) LIKE ? ORDER BY type,name",
                like, like, like, like, like, like);
    }
}
