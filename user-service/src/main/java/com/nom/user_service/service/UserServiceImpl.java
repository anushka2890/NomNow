package com.nom.user_service.service;

import com.nom.user_service.dto.UserDTO;
import com.nom.user_service.model.User;
import com.nom.user_service.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;

    private UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getPhone());
    }

    private User toEntity(UserDTO dto) {
        return new User(dto.getId(), dto.getName(), dto.getEmail(), dto.getPhone());
    }

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User saved = userRepository.save(toEntity(userDTO));
        return toDTO(saved);
    }

    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setName(userDTO.getName());
                    existingUser.setEmail(userDTO.getEmail());
                    existingUser.setPhone(userDTO.getPhone());
                    return toDTO(userRepository.save(existingUser));
                }).orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::toDTO)
                .orElse(null);
    }
}
