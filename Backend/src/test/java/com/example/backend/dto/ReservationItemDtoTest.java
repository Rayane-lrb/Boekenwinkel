package com.example.backend.dto;

import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class ReservationItemDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {

        validator = Validation.buildDefaultValidatorFactory().getValidator();

    }

    @Test
    void whenCreateReservationItemDtoIsValid_thenNoViolations() {
        ReservationItemRequestDto dto = new ReservationItemRequestDto();
        dto.setIsbn("9783161484100");
        dto.setQuantity(2);

        Set<ConstraintViolation<ReservationItemRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid reservation item DTO should not have violations");
    }

    @Test
    void whenCreateReservationItemDtoHasBlankIsbn_thenValidationFails() {
        ReservationItemRequestDto dto = new ReservationItemRequestDto();
        dto.setIsbn("");
        dto.setQuantity(2);

        Set<ConstraintViolation<ReservationItemRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Book ISBN is required", violations.iterator().next().getMessage());
    }

    @Test
    void whenCreateReservationItemDtoHasInvalidQuantity_thenValidationFails() {
        ReservationItemRequestDto dto = new ReservationItemRequestDto();
        dto.setIsbn("9783161484100");
        dto.setQuantity(0);

        Set<ConstraintViolation<ReservationItemRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Quantity must be at least 1", violations.iterator().next().getMessage());
    }

}
