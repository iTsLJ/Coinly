package com.coinly.api.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "coinly.jwt")
public record JwtProperties(String secret, long expirationMinutes) {
}
