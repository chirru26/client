package com.chirru.portfolio.service;

import com.chirru.portfolio.dto.admin.*;
import com.chirru.portfolio.entity.*;
import com.chirru.portfolio.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminPortfolioService {
    private final ProfileRepository profileRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final ExperienceRepository experienceRepository;
    private final EducationRepository educationRepository;
    private final CertificationRepository certificationRepository;
    private final MessageRepository messageRepository;
    private final FeatureManagementService featureManagementService;

    @Transactional(readOnly = true)
    public AdminDashboardResponse dashboard() {
        return new AdminDashboardResponse(projectRepository.count(), skillRepository.count(),
                experienceRepository.count(), educationRepository.count(), certificationRepository.count(),
                messageRepository.countByReadFalse());
    }

    @Transactional(readOnly = true)
    public Profile getProfile() {
        return profileRepository.findAll().stream().findFirst().orElseThrow(() -> notFound("Profile not configured"));
    }

    public Profile saveProfile(ProfileRequest r) {
        Profile p = profileRepository.findAll().stream().findFirst().orElseGet(Profile::new);
        p.setName(r.name());
        p.setHeadline(r.headline());
        p.setBio(r.bio());
        p.setEmail(r.email());
        p.setLocation(r.location());
        p.setGithubUrl(r.githubUrl());
        p.setLinkedinUrl(r.linkedinUrl());
        p.setResumeUrl(r.resumeUrl());
        p.setResumePublicId(r.resumePublicId());
        p.setImageUrl(r.imageUrl());
        p.setImagePublicId(r.imagePublicId());
        p.setOpenToWork(r.openToWork() != null ? r.openToWork() : true);
        return profileRepository.save(p);
    }

    @Transactional(readOnly = true)
    public List<Project> projects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc();
    }

    public Project createProject(ProjectRequest r) {
        Project p = new Project();
        apply(p, r);
        p = projectRepository.save(p);
        featureManagementService.setProjectTechnologies(p.getId(),
                r.technologyIds() != null ? r.technologyIds().stream().toList() : List.of());
        return p;
    }

    public Project updateProject(Long id, ProjectRequest r) {
        Project p = requireProject(id);
        apply(p, r);
        p = projectRepository.save(p);
        featureManagementService.setProjectTechnologies(p.getId(),
                r.technologyIds() != null ? r.technologyIds().stream().toList() : List.of());
        return p;
    }

    public void deleteProject(Long id) {
        projectRepository.delete(requireProject(id));
    }

    private void apply(Project p, ProjectRequest r) {
        p.setTitle(r.title());
        p.setDescription(r.description());
        p.setImageUrl(r.imageUrl());
        p.setGithubUrl(r.githubUrl());
        p.setLiveUrl(r.liveUrl());
        p.setFeatured(r.featured());
        p.setDisplayOrder(r.displayOrder());
        p.setSkills(r.skillIds() != null ? new HashSet<>(skillRepository.findAllById(r.skillIds())) : new HashSet<>());
    }

    @Transactional(readOnly = true)
    public List<Skill> skills() {
        return skillRepository.findAllByOrderByNameAsc();
    }

    public Skill createSkill(SkillRequest r) {
        Skill s = new Skill();
        apply(s, r);
        return skillRepository.save(s);
    }

    public Skill updateSkill(Long id, SkillRequest r) {
        Skill s = requireSkill(id);
        apply(s, r);
        return skillRepository.save(s);
    }

    public void deleteSkill(Long id) {
        skillRepository.delete(requireSkill(id));
    }

    private void apply(Skill s, SkillRequest r) {
        s.setName(r.name());
        s.setCategory(r.category());
        s.setIcon(r.icon());
    }

    @Transactional(readOnly = true)
    public List<Experience> experience() {
        return experienceRepository.findAllByOrderByDisplayOrderAscStartDateDesc();
    }

    public Experience createExperience(ExperienceRequest r) {
        Experience e = new Experience();
        apply(e, r);
        return experienceRepository.save(e);
    }

    public Experience updateExperience(Long id, ExperienceRequest r) {
        Experience e = requireExperience(id);
        apply(e, r);
        return experienceRepository.save(e);
    }

    public void deleteExperience(Long id) {
        experienceRepository.delete(requireExperience(id));
    }

    private void apply(Experience e, ExperienceRequest r) {
        e.setCompany(r.company());
        e.setPosition(r.position());
        e.setDescription(r.description());
        e.setStartDate(r.startDate());
        e.setEndDate(r.endDate());
        e.setCurrent(r.current());
        e.setDisplayOrder(r.displayOrder());
    }

    @Transactional(readOnly = true)
    public List<Education> education() {
        return educationRepository.findAllByOrderByDisplayOrderAscStartDateDesc();
    }

    public Education createEducation(EducationRequest r) {
        Education e = new Education();
        apply(e, r);
        return educationRepository.save(e);
    }

    public Education updateEducation(Long id, EducationRequest r) {
        Education e = requireEducation(id);
        apply(e, r);
        return educationRepository.save(e);
    }

    public void deleteEducation(Long id) {
        educationRepository.delete(requireEducation(id));
    }

    private void apply(Education e, EducationRequest r) {
        e.setInstitution(r.institution());
        e.setDegree(r.degree());
        e.setField(r.field());
        e.setDescription(r.description());
        e.setStartDate(r.startDate());
        e.setEndDate(r.endDate());
        e.setDisplayOrder(r.displayOrder());
    }

    @Transactional(readOnly = true)
    public List<Certification> certifications() {
        return certificationRepository.findAllByOrderByDisplayOrderAscIssueDateDesc();
    }

    public Certification createCertification(CertificationRequest r) {
        Certification c = new Certification();
        apply(c, r);
        return certificationRepository.save(c);
    }

    public Certification updateCertification(Long id, CertificationRequest r) {
        Certification c = requireCertification(id);
        apply(c, r);
        return certificationRepository.save(c);
    }

    public void deleteCertification(Long id) {
        certificationRepository.delete(requireCertification(id));
    }

    private void apply(Certification c, CertificationRequest r) {
        c.setName(r.name());
        c.setIssuer(r.issuer());
        c.setIssueDate(r.issueDate());
        c.setCredentialUrl(r.credentialUrl());
        c.setImageUrl(r.imageUrl());
        c.setDisplayOrder(r.displayOrder());
    }

    @Transactional(readOnly = true)
    public List<Message> messages() {
        return messageRepository.findAllByOrderByCreatedAtDesc();
    }

    public Message updateMessageStatus(Long id, boolean read) {
        Message m = requireMessage(id);
        m.setRead(read);
        return messageRepository.save(m);
    }

    public void deleteMessage(Long id) {
        messageRepository.delete(requireMessage(id));
    }

    @Transactional(readOnly = true)
    public long unreadMessages() {
        return messageRepository.countByReadFalse();
    }

    private Project requireProject(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> notFound("Project not found"));
    }

    private Skill requireSkill(Long id) {
        return skillRepository.findById(id).orElseThrow(() -> notFound("Skill not found"));
    }

    private Experience requireExperience(Long id) {
        return experienceRepository.findById(id).orElseThrow(() -> notFound("Experience not found"));
    }

    private Education requireEducation(Long id) {
        return educationRepository.findById(id).orElseThrow(() -> notFound("Education not found"));
    }

    private Certification requireCertification(Long id) {
        return certificationRepository.findById(id).orElseThrow(() -> notFound("Certification not found"));
    }

    private Message requireMessage(Long id) {
        return messageRepository.findById(id).orElseThrow(() -> notFound("Message not found"));
    }

    private ResponseStatusException notFound(String message) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, message);
    }
}
