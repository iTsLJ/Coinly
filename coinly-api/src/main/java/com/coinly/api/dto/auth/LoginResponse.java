package com.coinly.api.dto.auth;

import java.time.Instant;
import java.util.List;

public record LoginResponse(
        String token,
        Instant expiresAt,
        String email,
        List<String> roles
) {
}
