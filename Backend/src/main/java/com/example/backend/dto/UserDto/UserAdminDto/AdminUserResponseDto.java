package com.example.backend.dto.UserDto.UserAdminDto;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

public record AdminUserResponseDto(
        UUID id,
        String email,
        String firstName,
        String lastName,
        Set<String> roles,
        LocalDateTime createdAt
) {
}
