package com.example.backend.dto.ReservationDto;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

public class ReservationRequestDto {

    @NotEmpty(message = "Reservation must contain at least one item")
    private List<@Valid ReservationItemRequestDto> items = new ArrayList<>();

    public ReservationRequestDto() {
    }

    public List<ReservationItemRequestDto> getItems() {
        return items;
    }

    public void setItems(List<ReservationItemRequestDto> items) {
        this.items = items;
    }
}
