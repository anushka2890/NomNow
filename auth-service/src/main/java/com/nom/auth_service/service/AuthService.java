package com.nom.auth_service.service;

import com.nom.auth_service.dto.AuthRequest;
import com.nom.auth_service.dto.AuthResponse;
import com.nom.auth_service.model.AuthUser;
import com.nom.auth_service.repository.AuthRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private AuthRepository repo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse login(AuthRequest request) {
        AuthUser user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail());
    }

    public String register(AuthRequest request) {
        AuthUser user = new AuthUser();
        user.setEmail(request.getEmail());
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("USER");
        repo.save(user);
        return "User registered";
    }
}
