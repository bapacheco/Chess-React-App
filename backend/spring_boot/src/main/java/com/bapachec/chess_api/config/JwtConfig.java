package com.bapachec.chess_api.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.crypto.SecretKey;

@Configuration
public class JwtConfig {

    @Value("${myapp.configure.secret}")
    private String jwtSecret;

    @Bean
    public SecretKey mySecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }
}
