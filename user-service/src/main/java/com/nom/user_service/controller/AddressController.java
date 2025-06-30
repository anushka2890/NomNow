package com.nom.user_service.controller;

import com.nom.user_service.config.JwtUtil;
import com.nom.user_service.dto.AddressDTO;
import com.nom.user_service.service.AddressService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@RequestBody AddressDTO dto) {
        return ResponseEntity.ok(addressService.createAddress(dto));
    }

    @GetMapping("/user")
    public ResponseEntity<List<AddressDTO>> getAddressesForCurrentUser(HttpServletRequest request) {
        String token = extractTokenFromHeader(request);
        String email = jwtUtil.extractEmail(token);
        return ResponseEntity.ok(addressService.getAddressesByUserEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    private String extractTokenFromHeader(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7); // remove "Bearer "
        }
        throw new RuntimeException("Missing or invalid Authorization header");
    }
}

