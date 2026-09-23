package com.chirru.portfolio.dto.admin;

public record AdminDashboardResponse(
        long projects,
        long skills,
        long experience,
        long education,
        long certifications,
        long unreadMessages
) {}
