package com.example.backend.service;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemResponseDto;
import com.example.backend.model.Book;
import com.example.backend.model.Reservation;
import com.example.backend.model.ReservationItem;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.ReservationItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReservationItemService {

    private ReservationItemRepository reservationItemRepository;
    private BookRepository bookRepository;

    public ReservationItemService(ReservationItemRepository reservationItemRepository, BookRepository bookRepository) {
        this.reservationItemRepository = reservationItemRepository;
        this.bookRepository = bookRepository;
    }

    public ReservationItem createReservationItem(Reservation reservation, ReservationItemRequestDto dto) {
        Book book = findBookOrThrow(dto.getIsbn());

        ReservationItem reservationItem = new ReservationItem();
        reservationItem.setBook(book);
        reservationItem.setReservation(reservation);
        reservationItem.setQuantity(dto.getQuantity());
        reservationItem.setPriceAtReservation(calculatePriceForQuantity(book.getPrice(), dto.getQuantity()));

        return reservationItem;
    }

    @Transactional(readOnly = true)
    public List<ReservationItemResponseDto> getAllReservationItems() {
        return reservationItemRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ReservationItemResponseDto getReservationItemById(UUID reservationItemId) {
        ReservationItem reservationItem = findReservationItemOrThrow(reservationItemId);
        return mapToResponseDto(reservationItem);
    }

    public ReservationItemResponseDto updateReservationItem(UUID reservationItemId, ReservationItemRequestDto dto) {
        ReservationItem reservationItem = findReservationItemOrThrow(reservationItemId);
        Book book = findBookOrThrow(dto.getIsbn());

        reservationItem.setBook(book);
        reservationItem.setQuantity(dto.getQuantity());
        reservationItem.setPriceAtReservation(calculatePriceForQuantity(book.getPrice(), dto.getQuantity()));
        ReservationItem updatedReservationItem = reservationItemRepository.save(reservationItem);

        return new ReservationItemResponseDto(
                updatedReservationItem.getId(),
                updatedReservationItem.getBook().getIsbn(),
                updatedReservationItem.getQuantity(),
                updatedReservationItem.getPriceAtReservation()
        );
    }

    public void deleteReservationItem(UUID reservationItemId) {
        ReservationItem reservationItem = findReservationItemOrThrow(reservationItemId);
        reservationItemRepository.delete(reservationItem);
    }

    private BigDecimal calculatePriceForQuantity(BigDecimal price, int quantity) {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    private ReservationItem findReservationItemOrThrow(UUID reservationItemId) {
        return reservationItemRepository.findById(reservationItemId)
                .orElseThrow(() -> new RuntimeException("Reservation item not found"));
    }

    private Book findBookOrThrow(String isbn) {
        return bookRepository.findById(isbn)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    private ReservationItemResponseDto mapToResponseDto(ReservationItem reservationItem) {

        return new ReservationItemResponseDto(
                reservationItem.getId(),
                reservationItem.getBook().getIsbn(),
                reservationItem.getQuantity(),
                reservationItem.getPriceAtReservation()
        );
    }
}
