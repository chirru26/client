package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record EducationRequest(
        @NotBlank @Size(max = 250) String institution,
        @NotBlank @Size(max = 200) String degree,
        @Size(max = 200) String field,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        int displayOrder
) {}
