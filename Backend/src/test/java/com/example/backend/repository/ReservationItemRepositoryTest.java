package com.example.backend.repository;

import com.example.backend.model.Book;
import com.example.backend.model.Reservation;
import com.example.backend.model.ReservationItem;
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
class ReservationItemRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.4");

    @Autowired
    private ReservationItemRepository reservationItemRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindReservationItemExpectation() {
        User user = new User();
        user.setEmail("item.user@example.com");
        user.setFirstName("Dave");
        user.setLastName("Wilson");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);
        reservation = reservationRepository.save(reservation);

        Book book = new Book();
        book.setIsbn("9781234567890");
        book.setTitle("Test Book Item");
        book.setDescription("Description");
        book.setPrice(BigDecimal.valueOf(25.00));
        book.setStock(5);
        book = bookRepository.save(book);

        ReservationItem item = new ReservationItem();
        item.setQuantity(2);
        item.setPriceAtReservation(BigDecimal.valueOf(24.99));
        item.setReservation(reservation);
        item.setBook(book);

        ReservationItem savedItem = reservationItemRepository.saveAndFlush(item);
        entityManager.clear();

        Optional<ReservationItem> foundItem = reservationItemRepository.findById(savedItem.getId());
        assertTrue(foundItem.isPresent());
        assertEquals(2, foundItem.get().getQuantity());
        assertEquals(0, BigDecimal.valueOf(24.99).compareTo(foundItem.get().getPriceAtReservation()));
        assertNotNull(foundItem.get().getReservation());
        assertNotNull(foundItem.get().getBook());
    }

    @Test
    public void updateReservationItemExpectation() {
        User user = new User();
        user.setEmail("update.item@example.com");
        user.setFirstName("Eva");
        user.setLastName("Green");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);
        reservation = reservationRepository.save(reservation);

        Book book = new Book();
        book.setIsbn("9780987654321");
        book.setTitle("Another Book");
        book.setDescription("Description");
        book.setPrice(BigDecimal.valueOf(30.00));
        book.setStock(8);
        book = bookRepository.save(book);

        ReservationItem item = new ReservationItem();
        item.setQuantity(1);
        item.setPriceAtReservation(BigDecimal.valueOf(29.99));
        item.setReservation(reservation);
        item.setBook(book);

        ReservationItem savedItem = reservationItemRepository.saveAndFlush(item);
        entityManager.clear();

        ReservationItem toEdit = reservationItemRepository.findById(savedItem.getId()).orElseThrow();
        toEdit.setQuantity(4);
        reservationItemRepository.saveAndFlush(toEdit);
        entityManager.clear();

        ReservationItem reloaded = reservationItemRepository.findById(savedItem.getId()).orElseThrow();
        assertEquals(4, reloaded.getQuantity());
    }

    @Test
    public void deleteReservationItemExpectation() {
        User user = new User();
        user.setEmail("delete.item@example.com");
        user.setFirstName("Frank");
        user.setLastName("Castle");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);
        reservation = reservationRepository.save(reservation);

        Book book = new Book();
        book.setIsbn("9781122334455");
        book.setTitle("Delete Book");
        book.setDescription("Description");
        book.setPrice(BigDecimal.valueOf(10.00));
        book.setStock(2);
        book = bookRepository.save(book);

        ReservationItem item = new ReservationItem();
        item.setQuantity(1);
        item.setPriceAtReservation(BigDecimal.valueOf(9.99));
        item.setReservation(reservation);
        item.setBook(book);

        ReservationItem savedItem = reservationItemRepository.saveAndFlush(item);
        UUID itemId = savedItem.getId();
        entityManager.clear();

        reservationItemRepository.deleteById(itemId);
        reservationItemRepository.flush();

        assertFalse(reservationItemRepository.existsById(itemId));
    }
}