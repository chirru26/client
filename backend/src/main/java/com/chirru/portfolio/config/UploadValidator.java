package com.chirru.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class UploadValidator {
    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp");
    private static final Set<String> DOCUMENT_TYPES = Set.of(
            "application/pdf");

    private final long maxImageBytes;
    private final long maxDocumentBytes;

    public UploadValidator(
            @Value("${app.security.upload.max-image-bytes:5242880}") long maxImageBytes,
            @Value("${app.security.upload.max-document-bytes:10485760}") long maxDocumentBytes) {
        this.maxImageBytes = maxImageBytes;
        this.maxDocumentBytes = maxDocumentBytes;
    }

    public void validate(MultipartFile file, String resourceType) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        boolean raw = "raw".equalsIgnoreCase(resourceType);
        Set<String> allowed = raw ? DOCUMENT_TYPES : IMAGE_TYPES;
        long maxBytes = raw ? maxDocumentBytes : maxImageBytes;

        if (!allowed.contains(contentType)) {
            throw new IllegalArgumentException(raw
                    ? "Only PDF documents are allowed"
                    : "Only JPEG, PNG, and WebP images are allowed");
        }
        if (file.getSize() > maxBytes) {
            throw new IllegalArgumentException("File exceeds the configured upload size limit");
        }

        String filename = file.getOriginalFilename();
        if (filename != null && filename.contains("..")) {
            throw new IllegalArgumentException("Invalid filename");
        }
    }
}
