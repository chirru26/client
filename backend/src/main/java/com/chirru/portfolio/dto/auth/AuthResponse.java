package com.chirru.portfolio.dto.auth;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        String email,
        String role
) {}
