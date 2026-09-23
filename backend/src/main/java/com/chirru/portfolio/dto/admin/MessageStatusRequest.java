package com.chirru.portfolio.dto.admin;

import jakarta.validation.constraints.NotNull;

public record MessageStatusRequest(@NotNull Boolean read) {}
