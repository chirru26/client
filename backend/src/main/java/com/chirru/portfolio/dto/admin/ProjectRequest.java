package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record ProjectRequest(
                @NotBlank @Size(max = 200) String title,
                @NotBlank String description,
                @Size(max = 1000) String imageUrl,
                @Size(max = 500) String imagePublicId,
                @Size(max = 500) String githubUrl,
                @Size(max = 500) String liveUrl,
                boolean featured,
                int displayOrder,
                Set<Long> skillIds,
                Set<Long> technologyIds) {
}
