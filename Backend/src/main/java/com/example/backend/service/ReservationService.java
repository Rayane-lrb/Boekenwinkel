package com.example.backend.service;

import com.example.backend.dto.ReservationDto.ReservationRequestDto;
import com.example.backend.dto.ReservationDto.ReservationResponseDto;
import com.example.backend.dto.ReservationDto.ReservationStatusRequest.ReservationStatus;
import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import com.example.backend.model.Reservation;
import com.example.backend.model.ReservationItem;
import com.example.backend.model.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationService {
    private final UserRepository userRepository;

    private final ReservationRepository reservationRepository;

    private final BookRepository bookRepository;

    private final ReservationItemService reservationItemService;

    @Autowired
    public ReservationService(
            UserRepository userRepository,
            ReservationRepository reservationRepository,
            BookRepository bookRepository,
            ReservationItemService reservationItemService
    ) {
        this.userRepository = userRepository;
        this.reservationRepository = reservationRepository;
        this.bookRepository = bookRepository;
        this.reservationItemService = reservationItemService;
    }

    public ReservationResponseDto createReservation(ReservationRequestDto dto) {
        User currentUser = userRepository.findByEmail(currentEmail());
        if (currentUser == null) {
            throw new RuntimeException("Signed in user not found");
        }
        Reservation reservation = new Reservation();

        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(currentUser);

        for (ReservationItemRequestDto item : dto.getItems()) {
            ReservationItem reservationItem = reservationItemService.createReservationItem(reservation, item);
            reservation.getReservationItems().add(reservationItem);
        }

        return mapToResponseDto(reservationRepository.save(reservation));
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDto> getAllReservations() {
        List<Reservation> reservations = isAdmin()
                ? reservationRepository.findAll()
                : reservationRepository.findAllByUser_Email(currentEmail());
        return reservations.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponseDto getReservationById(UUID reservationId) {
        Reservation reservation = findReservationOrThrow(reservationId);
        ensureOwnerOrAdmin(reservation);
        return mapToResponseDto(reservation);
    }

    public ReservationResponseDto updateReservationStatus(UUID reservationId, ReservationStatus status) {
        if (!isAdmin()) {
            throw new AccessDeniedException("Only administrators can update reservation status");
        }

        Reservation reservation = findReservationOrThrow(reservationId);
        if (!"PENDING".equals(reservation.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only pending reservations can be updated");
        }

        if (status == ReservationStatus.CONFIRMED) {
            for (ReservationItem item : reservation.getReservationItems()) {
                String isbn = item.getBook().getIsbn();
                if (bookRepository.decrementStockIfAvailable(isbn, item.getQuantity()) == 0) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "Not enough stock for book " + isbn + "; reservation remains pending"
                    );
                }
            }
        }

        reservation.setStatus(status.name());
        reservation.setConfirmedAt(status == ReservationStatus.CONFIRMED ? LocalDateTime.now() : null);
        return mapToResponseDto(reservationRepository.save(reservation));
    }

    public void deleteReservation(UUID reservationid) {
        Reservation reservation = findReservationOrThrow(reservationid);
        ensureOwnerOrAdmin(reservation);
        reservationRepository.delete(reservation);
    }

    private Reservation findReservationOrThrow(UUID reservationId) {
        return reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }

    private void ensureOwnerOrAdmin(Reservation reservation) {
        if (!isAdmin() && !reservation.getUser().getEmail().equals(currentEmail())) {
            throw new AccessDeniedException("You are not allowed to access this reservation");
        }
    }

    private boolean isAdmin() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private ReservationResponseDto mapToResponseDto(Reservation reservation) {
        return new ReservationResponseDto(
                reservation.getId(),
                reservation.getStatus(),
                reservation.getCreatedAt(),
                reservation.getConfirmedAt(),
                reservation.getUser().getFirstName(),
                reservation.getUser().getLastName(),
                reservation.getReservationItems().stream()
                        .map(item -> new ReservationItemResponseDto(
                                item.getId(),
                                item.getBook().getIsbn(),
                                item.getQuantity(),
                                item.getPriceAtReservation()
                        ))
                        .toList()
        );
    }
}
