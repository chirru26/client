package com.chirru.portfolio.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "profile")
@Getter
@Setter
@NoArgsConstructor
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 150) private String name;
    @Column(length = 255) private String headline;
    @Column(columnDefinition = "TEXT") private String bio;
    @Column(length = 255) private String email;
    @Column(length = 150) private String location;
    @Column(name = "github_url", length = 500) private String githubUrl;
    @Column(name = "linkedin_url", length = 500) private String linkedinUrl;
    @Column(name = "resume_url", length = 500) private String resumeUrl;
    @Column(name = "resume_public_id", length = 500) private String resumePublicId;
    @Column(name = "image_url", length = 1000) private String imageUrl;
    @Column(name = "image_public_id", length = 500) private String imagePublicId;
    @Column(name = "open_to_work") private Boolean openToWork = true;
    @Column(name = "created_at", nullable = false, updatable = false) private Instant createdAt;
    @Column(name = "updated_at", nullable = false) private Instant updatedAt;

    @PrePersist void prePersist() { Instant now = Instant.now(); createdAt = now; updatedAt = now; }
    @PreUpdate void preUpdate() { updatedAt = Instant.now(); }
}
