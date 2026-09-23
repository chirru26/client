package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SkillRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 100) String category,
        @Size(max = 255) String icon
) {}
