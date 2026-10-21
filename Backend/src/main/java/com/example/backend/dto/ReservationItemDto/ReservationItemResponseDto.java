package com.example.backend.dto.ReservationItemDto;

import java.math.BigDecimal;
import java.util.UUID;

public record ReservationItemResponseDto(
        UUID id,
        String isbn,
        int quantity,
        BigDecimal priceAtReservation
) {
}
