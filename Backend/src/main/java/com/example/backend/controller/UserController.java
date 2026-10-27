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
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable UUID id) {
        UserResponseDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<UserResponseDto> addUser(@RequestBody UserRegisterDto dto) {
        UserResponseDto user = userRegisterService.resgisterUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> editUser(@PathVariable UUID id, @RequestBody UserUpdateDto dto) {
        UserResponseDto updatedUser = userService.updateUser(id, dto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/{id}/promote")
    public ResponseEntity<String> promoteUser(@PathVariable UUID id) {
        userService.promoteUser(id);
        return ResponseEntity.ok("User promoted to admin successfully");
    }
    @PutMapping("/{id}/demote")
    public ResponseEntity<String> demoteUser(@PathVariable UUID id) {
        userService.demoteUser(id);
        return ResponseEntity.ok("User demoted successfully");
    }
}
