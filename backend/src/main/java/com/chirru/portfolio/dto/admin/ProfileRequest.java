package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ProfileRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 255) String headline,
        String bio,
        @Email @Size(max = 255) String email,
        @Size(max = 50) String phone,
        @Size(max = 150) String location,
        @Size(max = 500) String githubUrl,
        @Size(max = 500) String linkedinUrl,
        @Size(max = 500) String resumeUrl,
        @Size(max = 500) String resumePublicId,
        @Size(max = 1000) String imageUrl,
        @Size(max = 500) String imagePublicId,
        Boolean openToWork
) {}
