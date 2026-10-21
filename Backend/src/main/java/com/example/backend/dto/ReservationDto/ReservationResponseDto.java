package com.example.backend.dto.ReservationDto;

import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ReservationResponseDto(
        UUID id,
        String status,
        LocalDateTime createdAt,
        LocalDateTime confirmedAt,
        List<ReservationItemResponseDto> items
) {
}
