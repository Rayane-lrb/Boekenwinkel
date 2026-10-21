package com.example.backend.dto.AuthorDto;

import java.util.UUID;

public record AuthorResponseDto(
        UUID id,
        String firstName,
        String lastName
) {
}
