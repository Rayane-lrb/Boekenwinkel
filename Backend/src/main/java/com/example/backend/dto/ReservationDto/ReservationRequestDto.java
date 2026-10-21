package com.example.backend.dto.ReservationDto;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class ReservationRequestDto {

    @NotEmpty(message = "Reservation must contain at least one item")
    private List<ReservationItemRequestDto> items;

    public ReservationRequestDto() {
    }

    public List<ReservationItemRequestDto> getItems() {
        return items;
    }

    public void setItems(List<ReservationItemRequestDto> items) {
        this.items = items;
    }
}
