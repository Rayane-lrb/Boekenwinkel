package com.example.backend.dto.BookDto;

import java.math.BigDecimal;

public record BookResponseDto(
        String isbn,
        String title,
        String description,
        BigDecimal price,
        int stock
) {
}
