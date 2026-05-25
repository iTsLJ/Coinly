package com.coinly.api.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "coinly.admin")
public record AdminProperties(String email, String senha, String nome) {
}
