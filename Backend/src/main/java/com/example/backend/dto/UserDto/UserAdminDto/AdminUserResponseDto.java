package com.example.backend.dto.UserDto.UserAdminDto;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.UUID;

public record AdminUserResponseDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        HashSet<String> roles,
        LocalDateTime createdAt
) {
}
