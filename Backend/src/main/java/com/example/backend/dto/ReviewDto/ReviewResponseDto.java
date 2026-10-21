package com.example.backend.dto.ReviewDto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewResponseDto(
        UUID id,
        int score,
        String text,
        LocalDateTime createdAt,
        String email,
        String isbn
) {
}
