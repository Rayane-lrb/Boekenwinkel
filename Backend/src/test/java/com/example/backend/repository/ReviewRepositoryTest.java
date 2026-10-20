package com.example.backend.repository;

import com.example.backend.model.Book;
import com.example.backend.model.Review;
import com.example.backend.model.User;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ReviewRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.4");

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindReviewExpectation() {
        // 1. Maak en bewaar de afhankelijke User en Book
        User user = new User();
        user.setEmail("reviewer@example.com");
        user.setPasswordHash("password123");
        user.setFirstName("Alice");
        user.setLastName("Wonder");
        user = userRepository.save(user);

        Book book = new Book();
        book.setIsbn("9783161484100");
        book.setTitle("Spring Boot Guide");
        book.setDescription("Comprehensive guide to Spring Boot");
        book.setPrice(BigDecimal.valueOf(39.99));
        book.setStock(15);
        book = bookRepository.save(book);

        // 2. Maak en bewaar de Review
        Review review = new Review();
        review.setScore(5);
        review.setText("Fantastic book!");
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setBook(book);

        Review savedReview = reviewRepository.saveAndFlush(review);
        entityManager.clear();

        // 3. Verifieer dat de review correct is opgeslagen en opgehaald
        Optional<Review> foundReview = reviewRepository.findById(savedReview.getId());
        assertTrue(foundReview.isPresent());
        assertEquals(5, foundReview.get().getScore());
        assertEquals("Fantastic book!", foundReview.get().getText());
        assertNotNull(foundReview.get().getUser());
        assertNotNull(foundReview.get().getBook());
    }

    @Test
    public void updateReviewExpectation() {
        User user = new User();
        user.setEmail("updater@example.com");
        user.setPasswordHash("password123");
        user.setFirstName("Bob");
        user.setLastName("Builder");
        user = userRepository.save(user);

        Book book = new Book();
        book.setIsbn("9781234567897");
        book.setTitle("Hibernate Mastery");
        book.setDescription("Learn Hibernate inside out");
        book.setPrice(BigDecimal.valueOf(45.00));
        book.setStock(10);
        book = bookRepository.save(book);

        Review review = new Review();
        review.setScore(3);
        review.setText("It was okay.");
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setBook(book);

        Review savedReview = reviewRepository.saveAndFlush(review);
        entityManager.clear();

        Review toEdit = reviewRepository.findById(savedReview.getId()).orElseThrow();
        toEdit.setScore(4);
        toEdit.setText("Actually, it grew on me!");
        reviewRepository.saveAndFlush(toEdit);
        entityManager.clear();

        Review reloaded = reviewRepository.findById(savedReview.getId()).orElseThrow();
        assertEquals(4, reloaded.getScore());
        assertEquals("Actually, it grew on me!", reloaded.getText());
    }

    @Test
    public void deleteReviewExpectation() {
        User user = new User();
        user.setEmail("deleter@example.com");
        user.setPasswordHash("password123");
        user.setFirstName("Charlie");
        user.setLastName("Brown");
        user = userRepository.save(user);

        Book book = new Book();
        book.setIsbn("9789876543210");
        book.setTitle("JPA Performance");
        book.setDescription("Optimize your queries");
        book.setPrice(BigDecimal.valueOf(29.99));
        book.setStock(20);
        book = bookRepository.save(book);

        Review review = new Review();
        review.setScore(2);
        review.setText("Not what I expected.");
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(user);
        review.setBook(book);

        Review savedReview = reviewRepository.saveAndFlush(review);
        UUID reviewId = savedReview.getId();
        entityManager.clear();

        reviewRepository.deleteById(reviewId);
        reviewRepository.flush();

        assertFalse(reviewRepository.existsById(reviewId));
    }
}