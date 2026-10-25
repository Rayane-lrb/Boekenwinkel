package com.example.backend.service.UserService;

import com.example.backend.dto.UserDto.UserRegisterDto;
import com.example.backend.dto.UserDto.UserResponseDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;

@Service
public class UserRegisterService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserRegisterService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDto resgisterUser(UserRegisterDto dto) {

        if(existsByEmail(dto.getEmail())) {
            throw new RuntimeException("There already is an existing user with this email");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());
        User user = new User();
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(hashedPassword);
        HashSet<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        user.setRoles(roles);
        User savedUser = userRepository.save(user);

        return new UserResponseDto(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getRoles()
        );
    }

    private Boolean existsByEmail(String userEmail) {
        return userRepository.existsByEmail(userEmail);
    }
}
