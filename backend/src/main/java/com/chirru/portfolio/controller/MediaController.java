package com.chirru.portfolio.controller;

import com.chirru.portfolio.service.CloudinaryService;
import com.chirru.portfolio.service.FeatureManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/admin/media")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class MediaController {
    private final CloudinaryService cloudinaryService;
    private final FeatureManagementService featureManagementService;

    @PostMapping("/{folder}")
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> upload(@PathVariable String folder, @RequestParam("file") MultipartFile file) {
        CloudinaryService.UploadFolder uploadFolder = CloudinaryService.UploadFolder.from(folder);
        String filename = file.getOriginalFilename();
        if (filename == null || filename.isBlank()) {
            throw new IllegalArgumentException("Original filename is required");
        }

        // Profile and resume are single-purpose slots: any new upload replaces the
        // current file even when the filename or extension changes. Other folders
        // replace only a file with the same original filename.
        var previous = featureManagementService.findMediaForReplacement(uploadFolder.path(), filename);
        CloudinaryService.UploadResult result = cloudinaryService.upload(file, uploadFolder);

        if (previous.isPresent() && !previous.get().publicId().equals(result.publicId())) {
            cloudinaryService.delete(previous.get().publicId(), previous.get().resourceType());
            featureManagementService.deleteMedia(previous.get().publicId());
        }

        long mediaId = featureManagementService.saveMedia(
                uploadFolder.path(), result.resourceType(), result.publicId(), result.url(),
                filename, file.getContentType(), file.getSize(), null, null);

        return Map.of("mediaId", mediaId, "url", "/api/v2/media/" + mediaId,
                "resourceType", result.resourceType(), "format",
                result.format() == null ? "" : result.format());
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@RequestParam String publicId, @RequestParam(defaultValue = "image") String resourceType) {
        cloudinaryService.delete(publicId, resourceType);
        featureManagementService.deleteMedia(publicId);
    }
}
