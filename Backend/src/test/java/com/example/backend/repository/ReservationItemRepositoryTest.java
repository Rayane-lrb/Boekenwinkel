package com.example.backend.repository;

import com.example.backend.model.ReservationItem;
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
    private EntityManager entityManager;

    @Test
    public void saveAndFindReservationItemExpectation() {
        ReservationItem item = new ReservationItem();
        item.setQuantity(3);
        item.setPriceAtReservation(BigDecimal.valueOf(15.50));

        ReservationItem savedItem = reservationItemRepository.save(item);
        entityManager.clear();

        Optional<ReservationItem> foundItem = reservationItemRepository.findById(savedItem.getId());
        assertTrue(foundItem.isPresent());
        assertEquals(3, foundItem.get().getQuantity());
        assertEquals(0, BigDecimal.valueOf(15.50).compareTo(foundItem.get().getPriceAtReservation()));
    }

    @Test
    public void updateReservationItemExpectation() {
        ReservationItem item = new ReservationItem();
        item.setQuantity(1);
        item.setPriceAtReservation(BigDecimal.valueOf(10.00));

        ReservationItem savedItem = reservationItemRepository.saveAndFlush(item);
        entityManager.clear();

        ReservationItem toEdit = reservationItemRepository.findById(savedItem.getId()).orElseThrow();
        toEdit.setQuantity(5);
        reservationItemRepository.saveAndFlush(toEdit);
        entityManager.clear();

        ReservationItem reloaded = reservationItemRepository.findById(savedItem.getId()).orElseThrow();
        assertEquals(5, reloaded.getQuantity());
    }

    @Test
    public void deleteReservationItemExpectation() {
        ReservationItem item = new ReservationItem();
        item.setQuantity(2);
        item.setPriceAtReservation(BigDecimal.valueOf(20.00));

        ReservationItem savedItem = reservationItemRepository.saveAndFlush(item);
        UUID itemId = savedItem.getId();
        entityManager.clear();

        reservationItemRepository.deleteById(itemId);
        reservationItemRepository.flush();

        assertFalse(reservationItemRepository.existsById(itemId));
    }
}