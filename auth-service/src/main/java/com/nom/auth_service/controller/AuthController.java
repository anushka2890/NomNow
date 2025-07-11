package com.nom.auth_service.controller;

import com.nom.auth_service.dto.AuthCreateRequestDTO;
import com.nom.auth_service.dto.AuthRequest;
import com.nom.auth_service.dto.AuthResponse;
import com.nom.auth_service.model.AuthUser;
import com.nom.auth_service.service.AuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody AuthCreateRequestDTO request) {
        log.info("Starting user registration process");
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/test")
    public ResponseEntity<String> secureEndpoint(Authentication authentication) {
        AuthUser user = (AuthUser) authentication.getPrincipal(); // ✅ Correct
        String email = user.getEmail();
        return ResponseEntity.ok("Hello, " + email);
    }
}
