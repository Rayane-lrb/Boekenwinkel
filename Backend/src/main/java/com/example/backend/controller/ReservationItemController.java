package com.example.backend.controller;

import com.example.backend.dto.ReservationDto.ReservationResponseDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import com.example.backend.model.ReservationItem;
import com.example.backend.service.ReservationItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/reservation_item")
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
    public ResponseEntity<ReservationItemResponseDto> getReservationItemById(UUID reservationItemId) {
        ReservationItemResponseDto reservation = reservationItemService.getReservationItemById(reservationItemId);
        return ResponseEntity.ok(reservation);
    }

    @PostMapping
    public ResponseEntity<ReservationItemResponseDto> addReservationItem(ReservationItemRequestDto dto) {
        ReservationItemResponseDto reservationItem = reservationItemService.createReservationItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReservationItemResponseDto> editReservationItem(UUID reservationItemId, ReservationItemRequestDto dto) {
        ReservationItemResponseDto updatedReservationItem = reservationItemService.updateReservationItem(reservationItemId, dto);
        return ResponseEntity.ok(updatedReservationItem);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReservationItem(UUID reservationItemId) {
        reservationItemService.deleteReservationItem(reservationItemId);
        return ResponseEntity.ok("Reservation item deleted successfully");
    }
}
