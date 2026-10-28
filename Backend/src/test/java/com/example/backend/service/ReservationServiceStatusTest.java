package com.example.backend.service;

import com.example.backend.dto.ReservationDto.ReservationStatusRequest.ReservationStatus;
import com.example.backend.model.Book;
import com.example.backend.model.Reservation;
import com.example.backend.model.ReservationItem;
import com.example.backend.model.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ReservationServiceStatusTest {

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void confirmsPendingReservationAndSetsConfirmationTime() {
        Reservation reservation = reservationWithStatus("PENDING");
        ReservationRepository repository = mock(ReservationRepository.class);
        BookRepository books = mock(BookRepository.class);
        when(repository.findById(reservation.getId())).thenReturn(Optional.of(reservation));
        when(repository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(books.decrementStockIfAvailable("demo-isbn", 2)).thenReturn(1);
        ReservationService service = service(repository, books);
        authenticateAsAdmin();

        var response = service.updateReservationStatus(reservation.getId(), ReservationStatus.CONFIRMED);

        assertEquals("CONFIRMED", response.status());
        assertEquals("Customer", response.userFirstName());
        assertEquals("Example", response.userLastName());
        assertNotNull(response.confirmedAt());
        verify(books).decrementStockIfAvailable("demo-isbn", 2);
        verify(repository).save(reservation);
    }

    @Test
    void cancelsPendingReservationWithoutConfirmationTime() {
        Reservation reservation = reservationWithStatus("PENDING");
        ReservationRepository repository = mock(ReservationRepository.class);
        BookRepository books = mock(BookRepository.class);
        when(repository.findById(reservation.getId())).thenReturn(Optional.of(reservation));
        when(repository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));
        authenticateAsAdmin();

        var response = service(repository, books).updateReservationStatus(reservation.getId(), ReservationStatus.CANCELED);

        assertEquals("CANCELED", response.status());
        assertNull(response.confirmedAt());
        verify(books, never()).decrementStockIfAvailable(anyString(), anyInt());
        verify(repository).save(reservation);
    }

    @Test
    void leavesReservationPendingWhenStockIsInsufficient() {
        Reservation reservation = reservationWithStatus("PENDING");
        ReservationRepository repository = mock(ReservationRepository.class);
        BookRepository books = mock(BookRepository.class);
        when(repository.findById(reservation.getId())).thenReturn(Optional.of(reservation));
        when(books.decrementStockIfAvailable("demo-isbn", 2)).thenReturn(0);
        authenticateAsAdmin();

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service(repository, books).updateReservationStatus(reservation.getId(), ReservationStatus.CONFIRMED)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        assertEquals("PENDING", reservation.getStatus());
        verify(repository, never()).save(any(Reservation.class));
    }

    @Test
    void rejectsStatusChangesAfterReservationIsFinalized() {
        Reservation reservation = reservationWithStatus("CONFIRMED");
        ReservationRepository repository = mock(ReservationRepository.class);
        BookRepository books = mock(BookRepository.class);
        when(repository.findById(reservation.getId())).thenReturn(Optional.of(reservation));
        when(repository.save(any(Reservation.class))).thenAnswer(invocation -> invocation.getArgument(0));
        authenticateAsAdmin();

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service(repository, books).updateReservationStatus(reservation.getId(), ReservationStatus.CANCELED)
        );

        assertEquals(HttpStatus.CONFLICT, exception.getStatusCode());
        verify(repository, never()).save(any(Reservation.class));
    }

    @Test
    void rejectsStatusChangesFromNonAdministrators() {
        ReservationRepository repository = mock(ReservationRepository.class);
        BookRepository books = mock(BookRepository.class);
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("user@example.com", "n/a", List.of())
        );

        assertThrows(
                AccessDeniedException.class,
                () -> service(repository, books).updateReservationStatus(UUID.randomUUID(), ReservationStatus.CONFIRMED)
        );

        verify(repository, never()).findById(any());
    }

    private ReservationService service(ReservationRepository repository, BookRepository books) {
        return new ReservationService(
                mock(UserRepository.class),
                repository,
                books,
                mock(ReservationItemService.class)
        );
    }

    private Reservation reservationWithStatus(String status) {
        Reservation reservation = new Reservation();
        reservation.setId(UUID.randomUUID());
        reservation.setStatus(status);
        reservation.setUser(new User(UUID.randomUUID(), "customer@example.com", "password", "Customer", "Example"));
        ReservationItem item = new ReservationItem(UUID.randomUUID(), 2, java.math.BigDecimal.valueOf(25));
        item.setBook(new Book("demo-isbn", "Demo book", "Demo description", java.math.BigDecimal.valueOf(12.5), 10));
        item.setReservation(reservation);
        reservation.getReservationItems().add(item);
        return reservation;
    }

    private void authenticateAsAdmin() {
        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken(
                        "admin@example.com",
                        "n/a",
                        List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
                )
        );
    }
}
