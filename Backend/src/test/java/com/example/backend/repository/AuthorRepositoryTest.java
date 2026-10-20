package com.example.backend.repository;

import com.example.backend.model.Author;
import com.example.backend.model.Book;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.AutoConfigureDataJpa;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.mysql.MySQLContainer;

import java.util.Optional;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class AuthorRepositoryTest {

    @Container
    @ServiceConnection
    static MySQLContainer mySQLContainer = new MySQLContainer("mysql:8.4");

    @Autowired
    private AuthorRepository authorRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    public void saveAndFindAuthorExpectation() {
        Author author = new Author();
        author.setFirstName("Tom");
        author.setLastName("Spow");
        authorRepository.saveAndFlush(author);
        entityManager.clear();

        Optional<Author> foundAuthor = authorRepository.findById(author.getId());
        assertTrue(foundAuthor.isPresent());
        assertEquals("Tom", foundAuthor.get().getFirstName());
        assertEquals("Spow", foundAuthor.get().getLastName());
    }
}