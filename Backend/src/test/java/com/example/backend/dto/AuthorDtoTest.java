package com.example.backend.dto;

import com.example.backend.dto.AuthorDto.AuthorRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class AuthorDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void whenCreateAuthorDtoIsValid_thenNoViolations() {
        AuthorRequestDto dto = new AuthorRequestDto();
        dto.setFirstName("George");
        dto.setLastName("Orwell");

        Set<ConstraintViolation<AuthorRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid author DTO should not have violations");
    }

    @Test
    void whenCreateAuthorDtoHasBlankFirstName_thenValidationFails() {
        AuthorRequestDto dto = new AuthorRequestDto();
        dto.setFirstName("");
        dto.setLastName("Orwell");

        Set<ConstraintViolation<AuthorRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("First name cannot be blank", violations.iterator().next().getMessage());
    }

    @Test
    void whenCreateAuthorDtoHasBlankLastName_thenValidationFails() {
        AuthorRequestDto dto = new AuthorRequestDto();
        dto.setFirstName("George");
        dto.setLastName("");

        Set<ConstraintViolation<AuthorRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Last name cannot be blank", violations.iterator().next().getMessage());
    }
}
