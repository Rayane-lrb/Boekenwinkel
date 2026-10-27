package com.example.backend.controller;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import com.example.backend.service.ReservationItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reservation_items")
public class ReservationItemController {
    private ReservationItemService reservationItemService;

    @Autowired
    public ReservationItemController(ReservationItemService reservationItemService) {
        this.reservationItemService = reservationItemService;
    }

    @GetMapping
    public ResponseEntity<Iterable<ReservationItemResponseDto>> getAllReservationItems() {
        return ResponseEntity.ok(reservationItemService.getAllReservationItems());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationItemResponseDto> getReservationItemById(@PathVariable UUID id) {
        ReservationItemResponseDto reservation = reservationItemService.getReservationItemById(id);
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationItemResponseDto> editReservationItem(@PathVariable UUID id, @RequestBody ReservationItemRequestDto dto) {
        ReservationItemResponseDto updatedReservationItem = reservationItemService.updateReservationItem(id, dto);
        return ResponseEntity.ok(updatedReservationItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservationItem(@PathVariable UUID id) {
        reservationItemService.deleteReservationItem(id);
        return ResponseEntity.ok("Reservation item deleted successfully");
    }
}
