package com.chirru.portfolio.service;

import com.chirru.portfolio.entity.AuditLog;
import com.chirru.portfolio.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditService {
    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(String action, String resource, HttpServletRequest request,
                       Authentication authentication, boolean success, String details) {
        AuditLog log = new AuditLog();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getName() != null && !"anonymousUser".equals(authentication.getName())) {
            log.setUserEmail(authentication.getName());
        }
        log.setAction(action);
        log.setResource(resource);
        log.setHttpMethod(request.getMethod());
        log.setPath(request.getRequestURI());
        log.setIpAddress(resolveClientIp(request));
        log.setSuccess(success);
        log.setDetails(details == null ? null : details.substring(0, Math.min(details.length(), 500)));
        auditLogRepository.save(log);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
