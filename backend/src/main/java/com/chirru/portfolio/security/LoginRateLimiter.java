package com.chirru.portfolio.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimiter {
    private final int maxFailedAttempts;
    private final Duration lockDuration;
    private final Map<String, AttemptState> attempts = new ConcurrentHashMap<>();

    public LoginRateLimiter(
            @Value("${app.security.login.max-failed-attempts:5}") int maxFailedAttempts,
            @Value("${app.security.login.lock-duration-seconds:900}") long lockDurationSeconds) {
        if (maxFailedAttempts < 1 || lockDurationSeconds < 1) {
            throw new IllegalArgumentException("Login rate-limit settings must be positive");
        }
        this.maxFailedAttempts = maxFailedAttempts;
        this.lockDuration = Duration.ofSeconds(lockDurationSeconds);
    }

    public void checkAllowed(String key) {
        AttemptState state = attempts.get(key);
        if (state == null) return;

        Instant now = Instant.now();
        if (state.lockedUntil() != null) {
            if (state.lockedUntil().isAfter(now)) {
                throw new LoginRateLimitException(state.lockedUntil());
            }
            attempts.remove(key, state);
        }
    }

    public void recordFailure(String key) {
        Instant now = Instant.now();
        attempts.compute(key, (ignored, current) -> {
            AttemptState state = current == null ? new AttemptState(0, null) : current;
            int failures = state.failedAttempts() + 1;
            return failures >= maxFailedAttempts
                    ? new AttemptState(failures, now.plus(lockDuration))
                    : new AttemptState(failures, null);
        });
    }

    public void recordSuccess(String key) {
        attempts.remove(key);
    }

    public void cleanup() {
        Instant now = Instant.now();
        attempts.entrySet().removeIf(entry -> {
            AttemptState state = entry.getValue();
            return state.lockedUntil() != null && state.lockedUntil().plus(lockDuration).isBefore(now);
        });
    }

    private record AttemptState(int failedAttempts, Instant lockedUntil) {}

    public static class LoginRateLimitException extends RuntimeException {
        private final Instant retryAt;

        public LoginRateLimitException(Instant retryAt) {
            super("Too many login attempts. Try again later.");
            this.retryAt = retryAt;
        }

        public Instant retryAt() {
            return retryAt;
        }
    }
}
