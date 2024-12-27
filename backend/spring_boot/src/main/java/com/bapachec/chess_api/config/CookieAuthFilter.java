package com.bapachec.chess_api.config;

import com.bapachec.chess_api.exceptions.UserNotFoundException;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.http.Cookie;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.Optional;

import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;

@Slf4j
@Component
public class CookieAuthFilter extends OncePerRequestFilter {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SecretKey mySecretKey;

    //private final SecretKey SECRET_KEY;
    Jws<Claims> jws;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        log.info("REACHED IN COOKIE AUTH");
        log.info("Cookies : " + Arrays.toString(request.getCookies()));
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

        log.info("tooken  value {}", token);

        if (token != null ) {
            try {
                jws = Jwts.parser()
                        .verifyWith(mySecretKey)
                        .build()
                        .parseSignedClaims(token);

                String userId = jws.getPayload().get("id").toString();
                log.info("userID {}", userId);
                Optional<User> user_opt = userRepository.findUserByUser_id(userId);

                if (user_opt.isEmpty()) {
                    throw new UserNotFoundException("Not real id");
                }

                User user = user_opt.get();
                log.info("USER EXISTS {}",user.getUser_id());

                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(user.getId(), null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.info("USER EXISTS {}",auth.getName());


            } catch (JwtException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT");
            } catch (UserNotFoundException e) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid User");
            }

            filterChain.doFilter(request, response);

        }


    }


}
