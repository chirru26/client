package com.chirru.portfolio.service;

import com.chirru.portfolio.dto.auth.AuthResponse;
import com.chirru.portfolio.dto.auth.LoginRequest;
import com.chirru.portfolio.entity.RefreshToken;
import com.chirru.portfolio.entity.User;
import com.chirru.portfolio.repository.RefreshTokenRepository;
import com.chirru.portfolio.repository.UserRepository;
import com.chirru.portfolio.security.JwtService;
import com.chirru.portfolio.security.LoginRateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final LoginRateLimiter loginRateLimiter;
    private final AuditService auditService;

    @Value("${app.jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${app.jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public AuthResult login(LoginRequest request, HttpServletRequest httpRequest) {
        String email = request.email().trim().toLowerCase();
        String key = email + "|" + clientIp(httpRequest);
        loginRateLimiter.checkAllowed(key);

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, request.password())
            );

            User user = userRepository.findByEmailIgnoreCase(authentication.getName())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            loginRateLimiter.recordSuccess(key);
            String refreshToken = issueRefreshToken(user);
            String accessToken = jwtService.generateAccessToken(
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal()
            );

            safeAudit("LOGIN_SUCCESS", "AUTH", httpRequest, authentication, true, null);
            return new AuthResult(authResponse(user, accessToken), refreshToken);
        } catch (BadCredentialsException ex) {
            loginRateLimiter.recordFailure(key);
            safeAudit("LOGIN_FAILURE", "AUTH", httpRequest, null, false, "Invalid credentials");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
    }

    @Transactional
    public AuthResult refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token is missing");
        }

        RefreshToken stored = refreshTokenRepository.findByTokenHashAndRevokedFalse(hash(rawRefreshToken))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token"));

        if (stored.getExpiresAt().isBefore(Instant.now())) {
            stored.setRevoked(true);
            refreshTokenRepository.save(stored);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token expired");
        }

        User user = stored.getUser();
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        var principal = org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
        String accessToken = jwtService.generateAccessToken(principal);
        String newRefreshToken = issueRefreshToken(user);

        return new AuthResult(authResponse(user, accessToken), newRefreshToken);
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) return;
        refreshTokenRepository.findByTokenHashAndRevokedFalse(hash(rawRefreshToken)).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    private AuthResponse authResponse(User user, String accessToken) {
        return new AuthResponse(accessToken, "Bearer", accessTokenExpiration / 1000,
                user.getEmail(), user.getRole().name());
    }

    private String issueRefreshToken(User user) {
        byte[] bytes = new byte[48];
        secureRandom.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash(hash(rawToken));
        token.setExpiresAt(Instant.now().plusMillis(refreshTokenExpiration));
        token.setRevoked(false);
        refreshTokenRepository.save(token);
        return rawToken;
    }

    private String hash(String value) {
        try {
            byte[] hashed = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hashed.length * 2);
            for (byte b : hashed) hex.append(String.format("%02x", b));
            return hex.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is unavailable", ex);
        }
    }

    private String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) return forwarded.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private void safeAudit(String action, String resource, HttpServletRequest request,
                           Authentication authentication, boolean success, String details) {
        try {
            auditService.record(action, resource, request, authentication, success, details);
        } catch (RuntimeException ignored) {
            // Authentication must not fail because audit storage is unavailable.
        }
    }

    public record AuthResult(AuthResponse response, String refreshToken) {}
}
