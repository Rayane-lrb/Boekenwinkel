package com.example.backend.repository;

import com.example.backend.model.Reservation;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ReservationRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.4");

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindReservationExpectation() {
        User user = new User();
        user.setEmail("reservation.user@example.com");
        user.setFirstName("Alice");
        user.setLastName("Smith");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);

        Reservation savedReservation = reservationRepository.saveAndFlush(reservation);
        entityManager.clear();

        Optional<Reservation> foundReservation = reservationRepository.findById(savedReservation.getId());
        assertTrue(foundReservation.isPresent());
        assertEquals("PENDING", foundReservation.get().getStatus());
    }

    @Test
    public void updateReservationExpectation() {
        User user = new User();
        user.setEmail("update.user@example.com");
        user.setFirstName("Bob");
        user.setLastName("Builder");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("PENDING");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);

        Reservation savedReservation = reservationRepository.saveAndFlush(reservation);
        entityManager.clear();

        Reservation toEdit = reservationRepository.findById(savedReservation.getId()).orElseThrow();
        toEdit.setStatus("CONFIRMED");
        toEdit.setConfirmedAt(LocalDateTime.now());
        reservationRepository.saveAndFlush(toEdit);
        entityManager.clear();

        Reservation reloaded = reservationRepository.findById(savedReservation.getId()).orElseThrow();
        assertEquals("CONFIRMED", reloaded.getStatus());
        assertNotNull(reloaded.getConfirmedAt());
    }

    @Test
    public void deleteReservationExpectation() {
        User user = new User();
        user.setEmail("delete.user@example.com");
        user.setFirstName("Charlie");
        user.setLastName("Brown");
        user.setPasswordHash("secret123");
        user = userRepository.save(user);

        Reservation reservation = new Reservation();
        reservation.setStatus("CANCELLED");
        reservation.setCreatedAt(LocalDateTime.now());
        reservation.setUser(user);

        Reservation savedReservation = reservationRepository.saveAndFlush(reservation);
        UUID reservationId = savedReservation.getId();
        entityManager.clear();

        reservationRepository.deleteById(reservationId);
        reservationRepository.flush();

        assertFalse(reservationRepository.existsById(reservationId));
    }
}