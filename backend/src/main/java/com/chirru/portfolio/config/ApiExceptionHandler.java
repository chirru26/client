package com.chirru.portfolio.config;

import com.chirru.portfolio.security.LoginRateLimiter.LoginRateLimitException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(LoginRateLimitException.class)
    ResponseEntity<Map<String, Object>> tooManyLoginAttempts(LoginRateLimitException ex) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header("Retry-After",
                        String.valueOf(Math.max(1, ex.retryAt().getEpochSecond() - Instant.now().getEpochSecond())))
                .body(Map.of("error", "TOO_MANY_REQUESTS", "message", ex.getMessage()));
    }

    @ExceptionHandler({ BadCredentialsException.class,
            org.springframework.security.core.AuthenticationException.class })
    ResponseEntity<Map<String, String>> unauthorized() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "UNAUTHORIZED", "message", "Invalid credentials"));
    }

    @ExceptionHandler(AccessDeniedException.class)
    ResponseEntity<Map<String, String>> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "FORBIDDEN", "message", "Access denied"));
    }

    @ExceptionHandler(ResponseStatusException.class)
    ResponseEntity<Map<String, Object>> responseStatus(ResponseStatusException ex) {
        String message = ex.getStatusCode().is4xxClientError() ? ex.getReason() : "Request failed";
        return ResponseEntity.status(ex.getStatusCode())
                .body(Map.of("error", ex.getStatusCode().toString(), "message",
                        message == null ? "Request failed" : message));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "VALIDATION_ERROR",
                "message", "Request validation failed",
                "fields", ex.getBindingResult().getFieldErrors().stream()
                        .collect(java.util.stream.Collectors.toMap(
                                error -> error.getField(),
                                error -> error.getDefaultMessage() == null ? "Invalid value"
                                        : error.getDefaultMessage(),
                                (first, ignored) -> first))));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    ResponseEntity<Map<String, String>> constraintViolation() {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "VALIDATION_ERROR", "message", "Request validation failed"));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<Map<String, String>> unexpected(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "INTERNAL_SERVER_ERROR", "message", "An unexpected error occurred"));
    }
}
