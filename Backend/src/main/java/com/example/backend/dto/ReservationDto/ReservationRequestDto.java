package com.example.backend.dto.ReservationDto;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public class ReservationRequestDto {

    private UUID userId;

    public ReservationRequestDto() {
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

}
