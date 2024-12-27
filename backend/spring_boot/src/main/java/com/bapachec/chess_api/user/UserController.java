package com.bapachec.chess_api.user;

import com.bapachec.chess_api.user.entity.Role;
import com.bapachec.chess_api.user.entity.User;
import com.bapachec.chess_api.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/session")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register-user")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody UserDto user_dto) {
        Role role = switch(user_dto.user_role()) {
            case "USER" -> Role.USER;
            default -> Role.GUEST;
        };

        User user = new User(user_dto.user_id(), role);
        userRepository.save(user);
        Map<String, String> res = new HashMap<>();
        res.put("success", "registered user");
        res.put("id", user_dto.user_id());
        return ResponseEntity.ok(res);
    }

    //todo: rework this or delete, this is just for testing
    @GetMapping("/pee")
    public String method(HttpServletRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        log.info(authentication.toString());
        log.info(authentication.getName() + " : Number ID");

        if (authentication.getName().equalsIgnoreCase("anonymousUser")) {
            return "notFound";
        }


        return "coco member";
    }




}
