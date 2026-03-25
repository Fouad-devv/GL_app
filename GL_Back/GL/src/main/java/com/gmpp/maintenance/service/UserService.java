package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.UserDTO;
import com.gmpp.maintenance.entity.User;
import com.gmpp.maintenance.enums.UserRole;
import com.gmpp.maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final KeycloakService keycloakService; // Service that talks to Keycloak

    // ---------- READ OPERATIONS ----------

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public UserDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDTO(user);
    }

    public List<UserDTO> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getActiveUsers() {
        return userRepository.findByActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getActiveUsersByRole(UserRole role) {
        return userRepository.findByActiveTrueAndRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> searchUsers(String search) {
        return userRepository.searchUsers(search).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long countUsersByRole(UserRole role) {
        return userRepository.countByRole(role);
    }

    public Long countActiveUsers() {
        return userRepository.countByActiveTrue();
    }

    // ---------- CREATE OPERATION ----------

    public UserDTO createUser(UserDTO userDTO) {
        // Create user in Keycloak
        String keycloakId = keycloakService.createUserInKeycloak(userDTO);

        // Save user in PostgreSQL
        User user = convertToEntity(userDTO);
        user.setKeycloakId(keycloakId); // store Keycloak ID
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setActive(true);
        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // ---------- UPDATE OPERATION ----------

    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user in Keycloak
        if (user.getKeycloakId() != null) {
            keycloakService.updateUserInKeycloak(user.getKeycloakId(), userDTO);
        }

        // Update user in PostgreSQL
        user.setFullName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(userDTO.getPassword());
        }
        user.setRole(userDTO.getRole());
        user.setSpecialties(userDTO.getSpecialties());
        user.setCertifications(userDTO.getCertifications());
        user.setUpdatedAt(LocalDateTime.now());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    // ---------- DELETE OPERATION ----------

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete user from Keycloak
        if (user.getKeycloakId() != null) {
            if (user.getKeycloakId() != null) {
                keycloakService.deleteUserInKeycloak(user.getKeycloakId());
            }
        }

        /* Soft delete in PostgreSQL
        user.setActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);*/

        userRepository.delete(user); // hard delete
    }

    // ---------- UTILITY METHODS ----------

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .specialties(user.getSpecialties())
                .certifications(user.getCertifications())
                .active(user.getActive())
                .keycloakId(user.getKeycloakId())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private User convertToEntity(UserDTO dto) {
        return User.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .specialties(dto.getSpecialties())
                .certifications(dto.getCertifications())
                .build();
    }
}