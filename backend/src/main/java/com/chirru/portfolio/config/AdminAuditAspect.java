package com.chirru.portfolio.config;

import com.chirru.portfolio.service.AuditService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AdminAuditAspect {
    private final AuditService auditService;
    private final HttpServletRequest request;

    @Around("execution(* com.chirru.portfolio.controller.Admin*.*(..)) || execution(* com.chirru.portfolio.controller.MediaController.*(..))")
    public Object audit(ProceedingJoinPoint joinPoint) throws Throwable {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String action = joinPoint.getSignature().getName().toUpperCase();
        String resource = joinPoint.getSignature().getDeclaringType().getSimpleName();

        try {
            Object result = joinPoint.proceed();
            safeRecord(action, resource, authentication, true, null);
            return result;
        } catch (Throwable ex) {
            safeRecord(action, resource, authentication, false, ex.getClass().getSimpleName() + ": " + ex.getMessage());
            throw ex;
        }
    }

    private void safeRecord(String action, String resource, Authentication authentication,
                            boolean success, String details) {
        try {
            auditService.record(action, resource, request, authentication, success, details);
        } catch (RuntimeException ignored) {
            // Auditing must never make an otherwise valid admin request fail.
        }
    }
}
