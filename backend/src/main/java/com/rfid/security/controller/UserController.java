package com.rfid.security.controller;

import com.rfid.security.model.*;
import com.rfid.security.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public Page<User> getUsers(
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User.UserStatus status = null;
        return userRepository.searchUsers(search.isBlank() ? null : search, status,
                PageRequest.of(page, size, Sort.by("name")));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@Valid @RequestBody UserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        Role role = roleRepository.findByName(req.getRole()).orElseThrow();
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "changeme123"))
                .department(req.getDepartment())
                .role(role)
                .status(User.UserStatus.ACTIVE)
                .build();
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserRequest req) {
        return userRepository.findById(id).map(u -> {
            if (req.getName() != null) u.setName(req.getName());
            if (req.getDepartment() != null) u.setDepartment(req.getDepartment());
            if (req.getRole() != null) roleRepository.findByName(req.getRole()).ifPresent(u::setRole);
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<User> deactivate(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            u.setStatus(User.UserStatus.INACTIVE);
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<User> activate(@PathVariable Long id) {
        return userRepository.findById(id).map(u -> {
            u.setStatus(User.UserStatus.ACTIVE);
            return ResponseEntity.ok(userRepository.save(u));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class UserRequest {
        @NotBlank private String name;
        @NotBlank private String email;
        private String password;
        private String department;
        private String role = "EMPLOYEE";
    }
}
