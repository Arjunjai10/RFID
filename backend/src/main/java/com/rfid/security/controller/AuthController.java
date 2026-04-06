package com.rfid.security.controller;

import com.rfid.security.model.User;
import com.rfid.security.repository.UserRepository;
import com.rfid.security.security.JwtTokenProvider;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userRepository.findByEmail(request.getUsername()).orElseThrow();
        String token = jwtTokenProvider.generateToken(user.getEmail());

        return ResponseEntity.ok(Map.of(
            "token", token,
            "user", Map.of(
                "id",         user.getId(),
                "name",       user.getName(),
                "email",      user.getEmail(),
                "role",       user.getRole().getName(),
                "department", user.getDepartment() != null ? user.getDepartment() : ""
            )
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestAttribute("email") String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(Map.of(
            "id",         user.getId(),
            "name",       user.getName(),
            "email",      user.getEmail(),
            "role",       user.getRole().getName(),
            "department", user.getDepartment() != null ? user.getDepartment() : ""
        ));
    }

    @Data
    public static class LoginRequest {
        @NotBlank private String username;
        @NotBlank private String password;
    }
}
