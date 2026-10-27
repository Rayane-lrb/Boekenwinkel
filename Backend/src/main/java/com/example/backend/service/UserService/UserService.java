package com.example.backend.service.UserService;

import com.example.backend.dto.UserDto.UserResponseDto;
import com.example.backend.dto.UserDto.UserUpdateDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserById(UUID userId) {
        User user = findUserOrThrow(userId);
        return mapToResponseDto(user);
    }

    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return mapToResponseDto(user);
    }

    public UserResponseDto updateUser(UUID userId, UserUpdateDto dto) {
        User user = findUserOrThrow(userId);

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        User updatedUser = userRepository.save(user);

        return mapToResponseDto(updatedUser);
    }

    public void deleteUser(UUID userId) {
        User user = findUserOrThrow(userId);
        userRepository.delete(user);
    }

    @Transactional
    public void promoteUser(UUID userId) {
        User user = findUserOrThrow(userId);
        Set<String> roles = user.getRoles();
        roles.add("ROLE_ADMIN");
        userRepository.save(user);
    }

    @Transactional
    public void demoteUser(UUID userId) {
        User user = findUserOrThrow(userId);

        Set<String> roles = user.getRoles();
        roles.remove("ROLE_ADMIN");
        userRepository.save(user);
    }

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserResponseDto mapToResponseDto(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                new HashSet<>(user.getRoles())
        );
    }
}
