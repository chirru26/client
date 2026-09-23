package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CertificationRequest(
        @NotBlank @Size(max = 250) String name,
        @Size(max = 200) String issuer,
        LocalDate issueDate,
        @Size(max = 1000) String credentialUrl,
        @Size(max = 1000) String imageUrl,
        int displayOrder
) {}
