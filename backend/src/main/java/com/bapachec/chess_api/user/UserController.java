package com.bapachec.chess_api.user;

import com.bapachec.chess_api.user.entity.Role;
import com.bapachec.chess_api.user.entity.Token;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.TokenRepository;
import com.bapachec.chess_api.user.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
//@CrossOrigin(origins = "localhost:3000")
@RequestMapping("/api/session")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenRepository tokenRepository;

    @Value("${myapp.configure.maxAge}")
    private int maxAge;

    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> getToken(HttpServletResponse response) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info(authentication.toString());
        log.info(authentication.getName() + " : Number ID");

        Map<String, String> res = new HashMap<>();
        if (!authentication.getName().equalsIgnoreCase("anonymousUser")) {
            log.info(authentication.toString());
            log.info(authentication.getName() + " : Number ID");
            res.put("Message", "Already Good to GO!");
            return ResponseEntity.ok(res);
        }

        String token_value = generateAnonymousId();
        Instant now = Instant.now();

        Cookie cookie = new Cookie("userSessionCookie", token_value);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api");
        //cookie.setDomain("localhost");

        //int maxAge = 60 * 4;
        cookie.setMaxAge(maxAge);


        Instant expirationTimestamp = now.plus(maxAge, ChronoUnit.SECONDS);
        //cookie.setMaxAge(60*60*24);

        //replace guest with variable
        User user = new User(Role.GUEST);
        Token token = new Token(token_value, expirationTimestamp);

        //have to set to each other if using mapping
        user.setToken(token);
        token.setUser(user);


        //only one repository operation because it will cascade and persist the Token automatically
        userRepository.save(user);

        log.info("COOOKIIEEEE AGE {}", cookie.getMaxAge());

        response.addCookie(cookie);
        res.put("Message", "New Cookie");
        return ResponseEntity.ok(res);
    }

    //todo: rework this or delete, this is just for testing
    @GetMapping("/pee")
    public String method(HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //if (authentication.)
        log.info(authentication.toString());
        log.info(authentication.getName() + " : Number ID");

        if (authentication.getName().equalsIgnoreCase("anonymousUser")) {
            return "notFound";
        }

        return "coco member";
    }


    private String generateAnonymousId() {
        return java.util.UUID.randomUUID().toString();
    }

}
