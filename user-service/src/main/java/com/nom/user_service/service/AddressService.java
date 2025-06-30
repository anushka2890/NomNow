package com.nom.user_service.service;

import com.nom.user_service.dto.AddressDTO;

import java.util.List;

public interface AddressService {
    AddressDTO createAddress(AddressDTO dto);
    List<AddressDTO> getAddressesByUserId(Long userId);
    void deleteAddress(Long addressId);
    List<AddressDTO> getAddressesByUserEmail(String email);
}
