package com.chirru.portfolio.controller;

import com.chirru.portfolio.dto.admin.*;
import com.chirru.portfolio.entity.*;
import com.chirru.portfolio.service.AdminPortfolioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminPortfolioController {
    private final AdminPortfolioService service;

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() { return service.dashboard(); }

    @GetMapping("/profile")
    public Profile profile() { return service.getProfile(); }

    @PutMapping("/profile")
    public Profile updateProfile(@Valid @RequestBody ProfileRequest request) { return service.saveProfile(request); }

    @GetMapping("/projects")
    public List<Project> projects() { return service.projects(); }

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@Valid @RequestBody ProjectRequest request) { return service.createProject(request); }

    @PutMapping("/projects/{id}")
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) { return service.updateProject(id, request); }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) { service.deleteProject(id); }

    @GetMapping("/skills")
    public List<Skill> skills() { return service.skills(); }

    @PostMapping("/skills")
    @ResponseStatus(HttpStatus.CREATED)
    public Skill createSkill(@Valid @RequestBody SkillRequest request) { return service.createSkill(request); }

    @PutMapping("/skills/{id}")
    public Skill updateSkill(@PathVariable Long id, @Valid @RequestBody SkillRequest request) { return service.updateSkill(id, request); }

    @DeleteMapping("/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) { service.deleteSkill(id); }

    @GetMapping("/experience")
    public List<Experience> experience() { return service.experience(); }

    @PostMapping("/experience")
    @ResponseStatus(HttpStatus.CREATED)
    public Experience createExperience(@Valid @RequestBody ExperienceRequest request) { return service.createExperience(request); }

    @PutMapping("/experience/{id}")
    public Experience updateExperience(@PathVariable Long id, @Valid @RequestBody ExperienceRequest request) { return service.updateExperience(id, request); }

    @DeleteMapping("/experience/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExperience(@PathVariable Long id) { service.deleteExperience(id); }

    @GetMapping("/education")
    public List<Education> education() { return service.education(); }

    @PostMapping("/education")
    @ResponseStatus(HttpStatus.CREATED)
    public Education createEducation(@Valid @RequestBody EducationRequest request) { return service.createEducation(request); }

    @PutMapping("/education/{id}")
    public Education updateEducation(@PathVariable Long id, @Valid @RequestBody EducationRequest request) { return service.updateEducation(id, request); }

    @DeleteMapping("/education/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(@PathVariable Long id) { service.deleteEducation(id); }

    @GetMapping("/certifications")
    public List<Certification> certifications() { return service.certifications(); }

    @PostMapping("/certifications")
    @ResponseStatus(HttpStatus.CREATED)
    public Certification createCertification(@Valid @RequestBody CertificationRequest request) { return service.createCertification(request); }

    @PutMapping("/certifications/{id}")
    public Certification updateCertification(@PathVariable Long id, @Valid @RequestBody CertificationRequest request) { return service.updateCertification(id, request); }

    @DeleteMapping("/certifications/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCertification(@PathVariable Long id) { service.deleteCertification(id); }

    @GetMapping("/messages")
    public List<Message> messages() { return service.messages(); }

    @GetMapping("/messages/unread-count")
    public Map<String, Long> unreadCount() { return Map.of("count", service.unreadMessages()); }

    @PatchMapping("/messages/{id}/read")
    public Message updateMessageStatus(@PathVariable Long id, @Valid @RequestBody MessageStatusRequest request) {
        return service.updateMessageStatus(id, request.read());
    }

    @DeleteMapping("/messages/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMessage(@PathVariable Long id) { service.deleteMessage(id); }
}
