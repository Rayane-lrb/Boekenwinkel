package com.example.backend.repository;

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

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class UserRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mysql = new MySQLContainer("mysql:8.4");

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindUserExpectation() {
        User user = new User();
        user.setEmail("jane.doe@example.com");
        user.setPasswordHash("securepassword123");
        user.setFirstName("Jane");
        user.setLastName("Doe");

        User savedUser = userRepository.saveAndFlush(user);
        entityManager.clear();

        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        assertTrue(foundUser.isPresent());
        assertEquals("jane.doe@example.com", foundUser.get().getEmail());
        assertEquals("Jane", foundUser.get().getFirstName());
        assertEquals("Doe", foundUser.get().getLastName());
    }

    @Test
    public void updateUserExpectation() {
        User user = new User();
        user.setEmail("john.smith@example.com");
        user.setPasswordHash("mypassword123");
        user.setFirstName("John");
        user.setLastName("Smith");

        User savedUser = userRepository.saveAndFlush(user);
        entityManager.clear();

        User toEdit = userRepository.findById(savedUser.getId()).orElseThrow();
        toEdit.setFirstName("Jonathan");
        userRepository.saveAndFlush(toEdit);
        entityManager.clear();

        User reloaded = userRepository.findById(savedUser.getId()).orElseThrow();
        assertEquals("Jonathan", reloaded.getFirstName());
    }

    @Test
    public void deleteUserExpectation() {
        User user = new User();
        user.setEmail("delete.user@example.com");
        user.setPasswordHash("deletepass123");
        user.setFirstName("Mark");
        user.setLastName("Twain");

        User savedUser = userRepository.saveAndFlush(user);
        UUID userId = savedUser.getId();
        entityManager.clear();

        userRepository.deleteById(userId);
        userRepository.flush();

        assertFalse(userRepository.existsById(userId));
    }
}