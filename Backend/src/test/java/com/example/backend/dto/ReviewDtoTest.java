package com.example.backend.dto;

import com.example.backend.dto.ReviewDto.ReviewRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class ReviewDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void whenCreateReviewDtoIsValid_thenNoViolations() {
        ReviewRequestDto dto = new ReviewRequestDto();
        dto.setBookIsbn("9783161484100");
        dto.setScore(5);
        dto.setText("Excellent livre !");

        Set<ConstraintViolation<ReviewRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid review DTO should not have violations");
    }

    @Test
    void whenCreateReviewDtoHasInvalidScore_thenValidationFails() {
        ReviewRequestDto dto = new ReviewRequestDto();
        dto.setBookIsbn("9783161484100");
        dto.setScore(6);
        dto.setText("Hors limites");

        Set<ConstraintViolation<ReviewRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Score must be at most 5", violations.iterator().next().getMessage());
    }

    @Test
    void whenCreateReviewDtoHasBlankIsbn_thenValidationFails() {
        ReviewRequestDto dto = new ReviewRequestDto();
        dto.setBookIsbn("");
        dto.setScore(4);

        Set<ConstraintViolation<ReviewRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Book ISBN is required", violations.iterator().next().getMessage());
    }
}
