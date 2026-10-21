package com.example.backend.dto;

import com.example.backend.dto.ReservationDto.ReservationRequestDto;
import com.example.backend.dto.ReservationItemDto.ReservationItemRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class ReservationDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void whenCreateReservationDtoIsValid_thenNoViolations() {
        ReservationItemRequestDto itemDto = new ReservationItemRequestDto();
        itemDto.setIsbn("9783161484100");
        itemDto.setQuantity(2);

        ReservationRequestDto dto = new ReservationRequestDto();
        dto.setItems(List.of(itemDto));

        Set<ConstraintViolation<ReservationRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid reservation DTO should not have violations");
    }

    @Test
    void whenCreateReservationDtoHasEmptyItems_thenValidationFails() {
        ReservationRequestDto dto = new ReservationRequestDto();
        dto.setItems(List.of());

        Set<ConstraintViolation<ReservationRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Reservation must contain at least one item", violations.iterator().next().getMessage());
    }
}
