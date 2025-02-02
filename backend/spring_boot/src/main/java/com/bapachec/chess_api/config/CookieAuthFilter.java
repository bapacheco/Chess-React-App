package com.bapachec.chess_api.config;


import com.bapachec.chess_api.user.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.Cookie;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
@RequiredArgsConstructor
public class CookieAuthFilter extends OncePerRequestFilter {


    @Autowired
    private UserRepository userRepository;

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        //log.info("REACHED IN COOKIE AUTH");
        //log.info("Cookies : " + Arrays.toString(request.getCookies()));
        if (request.getCookies() == null) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }


        String token = Arrays.stream(request.getCookies())
                .filter(cookie -> "anonymous_token".equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);

        //log.info("tooken  value {}", token);
        String userId = null;

        if (token != null ) {

            userId = jwtUtil.userId(token);

            if (userId != null) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }

        }


        filterChain.doFilter(request, response);

    }


}

    /*
    Optional<User> user_opt = userRepository.findUserByUser_id(userId);

    if (user_opt.isEmpty()) {
        throw new UserNotFoundException("Not real id");
    }

     */