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

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private BigDecimal priceAtReservation;

    @ManyToOne
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne
    @JoinColumn(name = "isbn")
    private Book book;

    public ReservationItem() {
    }

    public ReservationItem(UUID id, int quantity, BigDecimal priceAtReservation) {
        this.id = id;
        this.quantity = quantity;
        this.priceAtReservation = priceAtReservation;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}