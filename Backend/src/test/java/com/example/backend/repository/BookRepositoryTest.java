package com.example.backend.repository;

import com.example.backend.model.Book;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class BookRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.4");

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindBookExpectation() {
        Book book = new Book();
        book.setIsbn("12345678");
        book.setTitle("book1");
        book.setDescription("Sample Description");
        book.setPrice(BigDecimal.valueOf(19.99));
        book.setStock(10);

        bookRepository.save(book);
        Optional<Book> foundBook = bookRepository.findById("12345678");
        assertTrue(foundBook.isPresent());
        assertEquals("book1", foundBook.get().getTitle());
    }

    @Test
    public void updateBookExpectation() {
        Book book = new Book();
        book.setIsbn("987654321");
        book.setTitle("old title");
        book.setDescription("Sample Description");
        book.setPrice(BigDecimal.valueOf(19.99));
        book.setStock(10);

        bookRepository.saveAndFlush(book);
        entityManager.clear();

        Book toEdit = bookRepository.findById("987654321").orElseThrow();
        toEdit.setTitle("new title");
        bookRepository.saveAndFlush(toEdit);
        entityManager.clear();

        Book reloaded = bookRepository.findById("987654321").orElseThrow();
        assertEquals("new title", reloaded.getTitle());
    }

    @Test
    public void deleteBookExpectation() {
        Book book = new Book();
        book.setIsbn("456");
        book.setTitle("removal");
        book.setDescription("Sample Description");
        book.setPrice(BigDecimal.valueOf(19.99));
        book.setStock(10);
        bookRepository.saveAndFlush(book);

        bookRepository.deleteById("456");
        bookRepository.flush();

        assertFalse(bookRepository.existsById("456"));
    }
}