package com.example.backend.dto.UserDto;

import java.util.HashSet;
import java.util.UUID;

public record UserResponseDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        HashSet<String> roles
) {
}
