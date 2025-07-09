package com.nom.auth_service.repository;

import com.nom.auth_service.model.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<AuthUser, Long> {
    Optional<AuthUser> findByEmail(String email);
    Boolean existsByEmail(String email);
}
