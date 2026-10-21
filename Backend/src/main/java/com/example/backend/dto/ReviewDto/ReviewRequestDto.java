package com.example.backend.dto.ReviewDto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public class ReviewRequestDto {

    @NotBlank(message = "Book ISBN is required")
    private String bookIsbn;

    @NotBlank(message = "A rating is needed")
    @Min(value = 1, message = "Score must be at least 1")
    @Max(value = 5, message = "Score must be at most 5")
    private int score;

    private String text;

    public ReviewRequestDto() {
    }

    public String getBookIsbn() {
        return bookIsbn;
    }

    public void setBookIsbn(String bookIsbn) {
        this.bookIsbn = bookIsbn;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
