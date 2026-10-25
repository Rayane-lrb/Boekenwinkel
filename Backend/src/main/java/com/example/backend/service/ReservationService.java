package com.example.backend.service;

import com.example.backend.dto.ReservationDto.ReservationRequestDto;
import com.example.backend.dto.ReservationDto.ReservationResponseDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import com.example.backend.model.Reservation;
import com.example.backend.model.ReservationItem;
import com.example.backend.model.User;
import com.example.backend.repository.ReservationItemRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService.UserRegister;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationService {
    private final UserRepository userRepository;

    private final ReservationItemRepository reservationItemRepository;

    private final ReservationRepository reservationRepository;

    private final ReservationItemService reservationItemService;

    @Autowired
    public ReservationService(UserRepository userRepository, ReservationItemRepository reservationItemRepository, ReservationRepository reservationRepository, ReservationItemService reservationItemService) {
        this.userRepository = userRepository;
        this.reservationItemRepository = reservationItemRepository;
        this.reservationRepository = reservationRepository;
        this.reservationItemService = reservationItemService;
    }

    public ReservationResponseDto createReservation(ReservationRequestDto dto, List<ReservationItemRequestDto> reservationItemDtos) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ReservationItemResponseDto> items = new ArrayList<>();

        User currentUser = userRepository.findByEmail(currentEmail);
        if (currentUser == null) {
            throw new RuntimeException("Signed in user not found");
        }
        Reservation reservation = new Reservation();

        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(currentUser);

        for (ReservationItemRequestDto item : reservationItemDtos) {
            ReservationItemResponseDto responseItem = reservationItemService.createReservationItem(item);
            items.add(responseItem);
        }
        reservation.setReservationItems(items);

        return mapToResponseDto(reservation);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDto> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponseDto getReservationById(UUID reservationId) {
        Reservation reservation = findReservationOrThrow(reservationId);
        return mapToResponseDto(reservation);
    }

    public void deleteReservation(UUID reservationid) {
        Reservation reservation = findReservationOrThrow(reservationid);
        for(ReservationItemResponseDto item : reservation.getReservationItems()) {
            reservationItemService.deleteReservationItem(item.id());
        }
        reservationRepository.delete(reservation);
    }

    private Reservation findReservationOrThrow(UUID reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    private ReservationResponseDto mapToResponseDto(Reservation reservation) {
        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getConfirmedAt(),
                reservation.getReservationItems()
        );
    }
}
