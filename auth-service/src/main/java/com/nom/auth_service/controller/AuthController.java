package com.nom.auth_service.controller;

import com.nom.auth_service.dto.AuthRequest;
import com.nom.auth_service.dto.AuthResponse;
import com.nom.auth_service.model.AuthUser;
import com.nom.auth_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/test")
    public ResponseEntity<String> secureEndpoint(Authentication authentication) {
        AuthUser user = (AuthUser) authentication.getPrincipal(); // ✅ Correct
        String email = user.getEmail();
        return ResponseEntity.ok("Hello, " + email);
    }
}
