package com.chirru.portfolio.controller;

import com.chirru.portfolio.entity.AuditLog;
import com.chirru.portfolio.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    private final AuditLogRepository auditLogRepository;

    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        return Map.of(
                "email", authentication.getName(),
                "role", authentication.getAuthorities().iterator().next().getAuthority()
        );
    }

    @GetMapping("/audit-logs")
    public Page<AuditLog> auditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }
}
