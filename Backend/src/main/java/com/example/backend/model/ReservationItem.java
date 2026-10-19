package com.example.backend.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "reservation_items")
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID reservationId;

    @Column(unique = true, nullable = false)
    private String isbn;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal priceAtReservation;

    public ReservationItem() {
    }

    public ReservationItem(UUID id, UUID reservationId, String isbn, int quantity, BigDecimal priceAtReservation) {
        this.id = id;
        this.reservationId = reservationId;
        this.isbn = isbn;
        this.quantity = quantity;
        this.priceAtReservation = priceAtReservation;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getReservationId() {
        return reservationId;
    }

    public void setReservationId(UUID reservationId) {
        this.reservationId = reservationId;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtReservation() {
        return priceAtReservation;
    }

    public void setPriceAtReservation(BigDecimal priceAtReservation) {
        this.priceAtReservation = priceAtReservation;
    }
}
