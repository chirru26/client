package com.chirru.portfolio.security;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class LoginRateLimiterCleanup {
    private final LoginRateLimiter loginRateLimiter;

    @Scheduled(fixedDelayString = "${app.security.login.cleanup-interval-seconds:600}000")
    public void cleanup() {
        loginRateLimiter.cleanup();
    }
}
