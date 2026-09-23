package com.chirru.portfolio.service;

import com.chirru.portfolio.config.UploadValidator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Map;

@Service
public class CloudinaryService {
    private final RestClient restClient = RestClient.builder().build();
    private final UploadValidator uploadValidator;
    private final String cloudName;
    private final String apiKey;
    private final String apiSecret;

    public CloudinaryService(
            UploadValidator uploadValidator,
            @Value("${app.cloudinary.cloud-name}") String cloudName,
            @Value("${app.cloudinary.api-key}") String apiKey,
            @Value("${app.cloudinary.api-secret}") String apiSecret) {
        this.uploadValidator = uploadValidator;
        this.cloudName = cloudName;
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
    }

    public UploadResult upload(MultipartFile file, UploadFolder folder) {
        uploadValidator.validate(file, folder.resourceType());
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new IllegalStateException("Cloudinary is not configured");
        }

        long timestamp = Instant.now().getEpochSecond();
        String folderPath = "chirru-portfolio/" + folder.path();
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            throw new IllegalArgumentException("Original filename is required");
        }

        String signature = sha1(
                "folder=" + folderPath
                        + "&timestamp=" + timestamp
                        + "&unique_filename=false"
                        + "&use_filename=true"
                        + apiSecret);

        ByteArrayResource resource = new ByteArrayResource(read(file)) {
            @Override public String getFilename() { return file.getOriginalFilename(); }
        };
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);
        body.add("api_key", apiKey);
        body.add("timestamp", timestamp);
        body.add("folder", folderPath);
        body.add("use_filename", "true");
        body.add("unique_filename", "false");
        body.add("signature", signature);

        Map<?, ?> result = restClient.post()
                .uri("https://api.cloudinary.com/v1_1/" + cloudName + "/" + folder.resourceType() + "/upload")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body)
                .retrieve()
                .body(Map.class);
        if (result == null) throw new IllegalStateException("Cloudinary returned an empty response");
        return new UploadResult(
                String.valueOf(result.get("secure_url")),
                String.valueOf(result.get("public_id")),
                String.valueOf(result.get("resource_type")),
                result.get("format") == null ? null : String.valueOf(result.get("format")));
    }

    public void delete(String publicId, String resourceType) {
        if (publicId == null || publicId.isBlank()) return;
        if (cloudName.isBlank() || apiKey.isBlank() || apiSecret.isBlank()) {
            throw new IllegalStateException("Cloudinary is not configured");
        }
        String safeResourceType = "raw".equalsIgnoreCase(resourceType) ? "raw" : "image";
        long timestamp = Instant.now().getEpochSecond();
        String signature = sha1("public_id=" + publicId + "&timestamp=" + timestamp + apiSecret);
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("public_id", publicId);
        body.add("api_key", apiKey);
        body.add("timestamp", String.valueOf(timestamp));
        body.add("signature", signature);
        restClient.post()
                .uri("https://api.cloudinary.com/v1_1/" + cloudName + "/" + safeResourceType + "/destroy")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    private byte[] read(MultipartFile file) {
        try { return file.getBytes(); }
        catch (Exception ex) { throw new IllegalStateException("Unable to read upload", ex); }
    }

    private String sha1(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-1").digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : digest) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (Exception ex) { throw new IllegalStateException("Unable to sign Cloudinary request", ex); }
    }

    public enum UploadFolder {
        PROFILE("profile", "image"),
        PROJECTS("projects", "image"),
        CERTIFICATIONS("certifications", "image"),
        RESUME("resume", "raw"),
        DOCUMENTS("documents", "raw");

        private final String path;
        private final String resourceType;

        UploadFolder(String path, String resourceType) {
            this.path = path;
            this.resourceType = resourceType;
        }
        public String path() { return path; }
        public String resourceType() { return resourceType; }

        public static UploadFolder from(String value) {
            for (UploadFolder folder : values()) {
                if (folder.path.equalsIgnoreCase(value)) return folder;
            }
            throw new IllegalArgumentException("Unsupported upload folder: " + value);
        }
    }

    public record UploadResult(String url, String publicId, String resourceType, String format) {}
}
