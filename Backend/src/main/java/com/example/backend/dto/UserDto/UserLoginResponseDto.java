package com.example.backend.dto.UserDto;

public record UserLoginResponseDto(
        String token,
        String type,
        String email
) {
}
