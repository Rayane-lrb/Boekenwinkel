package com.example.backend.dto.ReservationItemDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

public class ReservationItemRequestDto {

    @NotBlank(message = "Book ISBN is required")
    private String isbn;

    @Positive(message = "Quantity must be atleast 1")
    private int quantity;

    public ReservationItemRequestDto() {
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
}
