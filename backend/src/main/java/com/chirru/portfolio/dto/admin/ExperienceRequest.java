package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExperienceRequest(
        @NotBlank @Size(max = 200) String company,
        @NotBlank @Size(max = 200) String position,
        String description,
        @NotNull LocalDate startDate,
        LocalDate endDate,
        boolean current,
        int displayOrder
) {}
