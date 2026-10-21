package com.example.backend.dto;

import com.example.backend.dto.BookDto.BookRequestDto;
import com.example.backend.dto.UserDto.UserRegisterDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class UserRegisterDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void whenCreateBookDtoHasInvalidPrice_thenValidationFails() {
        BookRequestDto dto = new BookRequestDto();
        dto.setIsbn("9783161484100");
        dto.setTitle("Spring Boot in Action");
        dto.setPrice(BigDecimal.valueOf(-5.00));
        dto.setStock(5);

        Set<ConstraintViolation<BookRequestDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Price must be greater than zero", violations.iterator().next().getMessage());
    }

    @Test
    void whenRegisterUserDtoIsValid_thenNoViolations() {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setEmail("user@example.com");
        dto.setPassword("strongpassword123");
        dto.setFirstName("Jane");
        dto.setLastName("Doe");

        Set<ConstraintViolation<UserRegisterDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid user DTO should not have violations");
    }

    @Test
    void whenRegisterUserDtoHasInvalidEmail_thenValidationFails() {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setEmail("not-an-email");
        dto.setPassword("strongpassword123");
        dto.setFirstName("Jane");
        dto.setLastName("Doe");

        Set<ConstraintViolation<UserRegisterDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Invalid email format", violations.iterator().next().getMessage());
    }

    @Test
    void whenRegisterUserDtoHasShortPassword_thenValidationFails() {
        UserRegisterDto dto = new UserRegisterDto();
        dto.setEmail("user@example.com");
        dto.setPassword("12345");
        dto.setFirstName("Jane");
        dto.setLastName("Doe");

        Set<ConstraintViolation<UserRegisterDto>> violations = validator.validate(dto);
        assertFalse(violations.isEmpty());
        assertEquals("Password must be at least 8 characters long", violations.iterator().next().getMessage());
    }
}