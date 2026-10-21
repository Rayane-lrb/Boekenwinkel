package com.example.backend.dto.UserDto;

import java.util.Set;
import java.util.UUID;

public record UserResponseDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Set<String> roles
) {
}
