package com.nom.user_service.service;

import com.nom.user_service.dto.AddressDTO;
import com.nom.user_service.dto.UserDTO;
import com.nom.user_service.model.Address;
import com.nom.user_service.model.User;
import com.nom.user_service.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    public UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());

        List<AddressDTO> addressDTOs = user.getAddresses()
                .stream()
                .map(address -> {
                    AddressDTO a = new AddressDTO();
                    a.setId(address.getId());
                    a.setStreet(address.getStreet());
                    a.setCity(address.getCity());
                    a.setState(address.getState());
                    a.setPincode(address.getPincode());
                    a.setLabel(address.getLabel());
                    a.setUserId(user.getId()); // if needed
                    return a;
                })
                .toList();

        dto.setAddresses(addressDTOs);
        return dto;
    }


    private User toEntity(UserDTO dto) {
        return new User(dto.getId(), dto.getName(), dto.getEmail(), dto.getPhone());
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToUserDTO)
                .orElse(null);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User saved = userRepository.save(toEntity(userDTO));
        return convertToUserDTO(saved);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(userDTO.getName());
                    existingUser.setEmail(userDTO.getEmail());
                    existingUser.setPhone(userDTO.getPhone());

                    // Remove old addresses and replace with new ones
                    existingUser.getAddresses().clear();

                    if (userDTO.getAddresses() != null) {
                        for (AddressDTO addressDTO : userDTO.getAddresses()) {
                            Address address = new Address();
                            address.setStreet(addressDTO.getStreet());
                            address.setCity(addressDTO.getCity());
                            address.setState(addressDTO.getState());
                            address.setPincode(addressDTO.getPincode());
                            address.setLabel(addressDTO.getLabel());
                            address.setUser(existingUser); // Set back-reference
                            existingUser.getAddresses().add(address);
                        }
                    }

                    return convertToUserDTO(userRepository.save(existingUser));
                })
                .orElse(null);
    }


    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToUserDTO)
                .orElse(null);
    }
}
