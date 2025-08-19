package com.steganoAI.backend.presentation.controller;

import com.steganoAI.backend.application.dto.AuthResponse;
import com.steganoAI.backend.application.dto.LoginRequest;
import com.steganoAI.backend.domain.model.User;
import com.steganoAI.backend.domain.service.UserDomainService;
import com.steganoAI.backend.infrastructure.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3004", "http://localhost:3003"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDomainService userDomainService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            User user = userDomainService.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

            String jwt = jwtService.generateToken(user.getUsername(), user.getRole());

            return ResponseEntity.ok(new AuthResponse(
                    jwt,
                    user.getUsername(),
                    user.getRole(),
                    86400000L // 24h
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Nom d'utilisateur ou mot de passe incorrect"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageResponse("Déconnexion réussie"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Utilisateur non authentifié"));
        }

        User user = userDomainService.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        return ResponseEntity.ok(new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRole()
        ));
    }

    // DTOs internes pour les réponses
    static class ErrorResponse {
        public String error;
        public ErrorResponse(String error) { this.error = error; }
    }

    static class MessageResponse {
        public String message;
        public MessageResponse(String message) { this.message = message; }
    }

    static class UserResponse {
        public Long id;
        public String username;
        public String role;
        public UserResponse(Long id, String username, String role) {
            this.id = id;
            this.username = username;
            this.role = role;
        }
    }
}
