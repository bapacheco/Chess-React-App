package com.bapachec.chess_api.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cglib.core.internal.Function;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    @Value("${myapp.configure.secret}")
    private String jwtSecret;

    private SecretKey mySecretKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String userId(String token) {
        return extractClaim(token, claims -> claims.get("id", String.class));
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(mySecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

}
