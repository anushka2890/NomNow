package com.nom.auth_service.service;

import com.nom.auth_service.dto.AuthCreateRequestDTO;
import com.nom.auth_service.dto.AuthRequest;
import com.nom.auth_service.dto.AuthResponse;
import com.nom.auth_service.dto.UserDTO;
import com.nom.auth_service.model.AuthUser;
import com.nom.auth_service.repository.AuthRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AuthRepository repo;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    public AuthResponse login(AuthRequest request) {
        AuthUser user = repo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        String email = request.getEmail();
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Internal-Request", "auth-service"); // ✅

        HttpEntity<?> requestEntity = new HttpEntity<>(headers);
        ResponseEntity<UserDTO> response = restTemplate.exchange(
                "http://localhost:8084/api/users/email/" + email,
                HttpMethod.GET,
                requestEntity,
                UserDTO.class
        );
        UserDTO userDTO = response.getBody();
        if (userDTO == null) {
            throw new RuntimeException("User profile not found for token generation");
        }

        Long userId = userDTO.getId();
        String token = jwtService.generateToken(user.getEmail(), userId);
        return new AuthResponse(token, user.getEmail());
    }

    public Map<String, String> register(AuthCreateRequestDTO request) {
        log.info("In the service for registration");
        if (repo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        AuthUser user = new AuthUser();
        user.setEmail(request.getEmail());
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(hashedPassword);
        user.setRole("USER");
        repo.save(user);

        UserDTO userDTO = new UserDTO();
        userDTO.setName(request.getName());
        userDTO.setEmail(request.getEmail());
        userDTO.setPhone(request.getPhone());

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Internal-Request", "auth-service"); // ✅ Important for access
            HttpEntity<UserDTO> entity = new HttpEntity<>(userDTO, headers);

            ResponseEntity<UserDTO> response = restTemplate.exchange(
                    "http://localhost:8084/api/users",
                    HttpMethod.POST,
                    entity,
                    UserDTO.class
            );
            log.info("Information for user creation sent");
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new RuntimeException("User profile creation failed in user-service");
            }

        } catch (Exception e) {
            // Rollback if user-service fails
            repo.delete(user);
            throw new RuntimeException("User profile creation failed: " + e.getMessage());
        }

        return Map.of("message", "User registered");
    }
}
