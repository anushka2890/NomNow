package com.nom.user_service.controller;

import com.nom.user_service.config.JwtUtil;
import com.nom.user_service.dto.AddressDTO;
import com.nom.user_service.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<AddressDTO> createAddress(
            @RequestBody AddressDTO dto,
            @RequestHeader(value = "X-User-Id") String userIdHeader) {
        long userId;
        try {
            userId = Long.parseLong(userIdHeader);
        } catch (NumberFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null); // or throw exception
        }
        return ResponseEntity.ok(addressService.createAddress(dto, userId));
    }

    @GetMapping("/user")
    public ResponseEntity<List<AddressDTO>> getAddressesForCurrentUser(
            @RequestHeader(value = "X-User-Email") String email) {
        return ResponseEntity.ok(addressService.getAddressesByUserEmail(email));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }
}

