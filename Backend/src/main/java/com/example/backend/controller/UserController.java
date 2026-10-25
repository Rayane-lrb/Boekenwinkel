package com.example.backend.controller;

import com.example.backend.dto.UserDto.UserRegisterDto;
import com.example.backend.dto.UserDto.UserResponseDto;
import com.example.backend.dto.UserDto.UserUpdateDto;
import com.example.backend.service.UserService.UserRegisterService;
import com.example.backend.service.UserService.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private UserRegisterService userRegisterService;

    @Autowired
    public UserController(UserService userService, UserRegisterService userRegisterService) {
        this.userService = userService;
        this.userRegisterService = userRegisterService;
    }

    @GetMapping
    public ResponseEntity<Iterable<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    ResponseEntity<UserResponseDto> getUserById(UUID userId) {
        UserResponseDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> addUser(UserRegisterDto dto) {
        UserResponseDto user = userRegisterService.resgisterUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> editUser(UUID userId, UserUpdateDto dto) {
        UserResponseDto updatedUser = userService.updateUser(userId, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(UUID userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> promoteUser(UUID userId) {
        userService.promoteUser(userId);
        return ResponseEntity.ok("User promoted to admin successfully");
    }
    @PutMapping("/{id}")
    public ResponseEntity<String> demoteUser(UUID userId) {
        userService.demoteUser(userId);
        return ResponseEntity.ok("User demoted successfully");
    }
}
