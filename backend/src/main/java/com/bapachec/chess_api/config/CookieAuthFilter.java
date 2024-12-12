package com.bapachec.chess_api.config;

import com.bapachec.chess_api.user.entity.Token;
import com.bapachec.chess_api.user.repository.TokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.Cookie;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class CookieAuthFilter extends OncePerRequestFilter {


    @Autowired
    private TokenRepository tokenRepository;

    @Value("${myapp.configure.maxAge}")
    private int maxAge;

    @Value("${myapp.configure.renew.window}")
    private int renew_window;

    //Cookie::getValue === cookie -> cookie.getValue()
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //log.info("LEEEEEEE : " + request.getCookies());
        if (request.getRequestURI().equals("/api/session/token") && request.getCookies() == null) {
            filterChain.doFilter(request, response);
            return;
        }


        String token_value = Arrays.stream(request.getCookies())
                .filter(cookie -> "userSessionCookie".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        log.info("tooken  value {}", token_value);
        if (token_value != null ) {
            Optional<Token> OptToken = tokenRepository.findTokenByToken_value(token_value);
            if (OptToken.isPresent()) {
                //remove after=

                log.info(OptToken.get().getUser().getId().toString());
                Token token = OptToken.get();

                Authentication auth = new UsernamePasswordAuthenticationToken(
                        token.getUser().getId(), null, Collections.emptyList()
                );
                //remove after
                log.info(auth.getName() + "name in branch");
                log.info("Extracted cookie value: {}", auth);

                Instant currentTime = Instant.now();
                log.info("Current time: {}", currentTime);
                log.info("Token expiration time: {}", token.getExpiresAt());
                Duration duration = Duration.between(currentTime, token.getExpiresAt());
                if (duration.isPositive() && duration.getSeconds() <=  renew_window) {
                    Instant now = Instant.now();
                    Instant expirationTimestamp = now.plus(maxAge, ChronoUnit.SECONDS);
                    token.setExpiresAt(expirationTimestamp);
                    tokenRepository.save(token);
                    log.info("TOKEN UPDATED");
                }
                else {
                    //tell frontend to go to login or index.
                }
                SecurityContextHolder.getContext().setAuthentication(auth);

            }
        }

        filterChain.doFilter(request, response);
    }



}
