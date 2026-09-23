package com.chirru.portfolio.controller;

import com.chirru.portfolio.entity.*;
import com.chirru.portfolio.repository.*;
import com.chirru.portfolio.service.FeatureManagementService;
import com.chirru.portfolio.service.MediaService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/portfolio")
public class PublicPortfolioController {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final MessageRepository messageRepository;
    private final FeatureManagementService featureManagementService;
    private final MediaService mediaService;

    public PublicPortfolioController(ProfileRepository profileRepository, ProjectRepository projectRepository, SkillRepository skillRepository, ExperienceRepository experienceRepository, EducationRepository educationRepository, CertificationRepository certificationRepository, MessageRepository messageRepository, FeatureManagementService featureManagementService, MediaService mediaService) {
        this.profileRepository = profileRepository; this.projectRepository = projectRepository; this.skillRepository = skillRepository;
        this.experienceRepository = experienceRepository; this.educationRepository = educationRepository; this.certificationRepository = certificationRepository;
        this.messageRepository = messageRepository; this.featureManagementService = featureManagementService; this.mediaService = mediaService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileSummary> profile() {
        return profileRepository.findAll().stream().findFirst()
                .map(p -> {
                    String imageUrl = mediaService.resolveMediaUrl(p.getImagePublicId(), p.getImageUrl());
                    String resumeUrl = "/api/v2/portfolio/resume";
                    return ResponseEntity.ok(new ProfileSummary(p.getId(), p.getName(), p.getHeadline(), p.getBio(), p.getEmail(), p.getLocation(),
                            p.getGithubUrl(), p.getLinkedinUrl(), resumeUrl,
                            imageUrl, p.getOpenToWork()));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/projects")
    public List<ProjectSummary> projects(@RequestParam(required = false, defaultValue = "false") boolean featured) {
        List<Project> projects = featured ? projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc() : projectRepository.findAllByOrderByDisplayOrderAsc();
        return projects.stream().map(this::toProjectSummary).toList();
    }

    @GetMapping("/projects/{identifier}")
    public ResponseEntity<ProjectSummary> project(@PathVariable String identifier) {
        if (identifier == null || identifier.isBlank()) return ResponseEntity.notFound().build();
        try {
            Long id = Long.valueOf(identifier.trim());
            return projectRepository.findById(id).map(project -> ResponseEntity.ok(toProjectSummary(project))).orElseGet(() -> ResponseEntity.notFound().build());
        } catch (NumberFormatException ignored) {
            String cleanSlug = identifier.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
            return projectRepository.findAll().stream()
                    .filter(p -> {
                        String titleSlug = p.getTitle().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-+|-+$", "");
                        return titleSlug.equals(cleanSlug) || p.getTitle().equalsIgnoreCase(identifier.trim());
                    })
                    .findFirst()
                    .map(project -> ResponseEntity.ok(toProjectSummary(project)))
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }
    }

    @GetMapping("/skills")
    public List<Skill> skills(@RequestParam(required = false) String category) {
        List<Skill> skills = skillRepository.findAllByOrderByNameAsc();
        if (category == null || category.isBlank()) return skills;
        return skills.stream().filter(skill -> category.equalsIgnoreCase(skill.getCategory())).toList();
    }
    @GetMapping("/experience") public List<Experience> experience() { return experienceRepository.findAllByOrderByDisplayOrderAscStartDateDesc(); }
    @GetMapping("/education") public List<Education> education() { return educationRepository.findAllByOrderByDisplayOrderAscStartDateDesc(); }
    @GetMapping("/certifications") public List<Certification> certifications() { return certificationRepository.findAllByOrderByDisplayOrderAscIssueDateDesc(); }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> contact(@Valid @RequestBody ContactRequest request) {
        Message message = new Message(); message.setName(request.name()); message.setEmail(request.email()); message.setSubject(request.subject()); message.setMessage(request.message()); message.setRead(false); messageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Your message has been received."));
    }

    private ProjectSummary toProjectSummary(Project project) {
        List<SkillSummary> skills = project.getSkills().stream().map(skill -> new SkillSummary(skill.getId(), skill.getName(), skill.getCategory(), skill.getIcon())).toList();
        List<Map<String,Object>> technologies = featureManagementService.projectTechnologies(project.getId());
        String imageUrl = mediaService.resolveMediaUrl(project.getImagePublicId(), project.getImageUrl());
        return new ProjectSummary(project.getId(), project.getTitle(), project.getDescription(), imageUrl, project.getGithubUrl(), project.getLiveUrl(), project.isFeatured(), project.getDisplayOrder(), skills, technologies);
    }

    public record ProfileSummary(Long id, String name, String headline, String bio, String email, String location, String githubUrl, String linkedinUrl, String resumeUrl, String imageUrl, Boolean openToWork) {}
    public record SkillSummary(Long id, String name, String category, String icon) {}
    public record ProjectSummary(Long id, String title, String description, String imageUrl, String githubUrl, String liveUrl, boolean featured, int displayOrder, List<SkillSummary> skills, List<Map<String,Object>> technologies) {}
    public record ContactRequest(@NotBlank(message = "Name is required") String name, @NotBlank(message = "Email is required") @Email(message = "Invalid email address") String email, String subject, @NotBlank(message = "Message is required") String message) {}
}
