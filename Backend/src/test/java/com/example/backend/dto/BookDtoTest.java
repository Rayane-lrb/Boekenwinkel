package com.example.backend.dto;

import com.example.backend.dto.BookDto.BookRequestDto;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Set;

import static org.hibernate.validator.internal.util.Contracts.assertTrue;

public class BookDtoTest {

    private static Validator validator;

    @BeforeAll
    static void setUp() {

        validator = Validation.buildDefaultValidatorFactory().getValidator();

    }

    @Test
    void whenCreateBookDtoIsValid_thenNoViolations() {
        BookRequestDto dto = new BookRequestDto();
        dto.setIsbn("9783161484100");
        dto.setTitle("Spring Boot in Action");
        dto.setDescription("A great book");
        dto.setPrice(BigDecimal.valueOf(29.99));
        dto.setStock(10);

        Set<ConstraintViolation<BookRequestDto>> violations = validator.validate(dto);
        assertTrue(violations.isEmpty(), "Valid book DTO should not have violations");
    }
}
