package com.example.backend.repository;

import com.example.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, String> {

    Book findByIsbnContainsIgnoreCase(String isbn);

    @Query("SELECT b FROM Book b WHERE b.price BETWEEN :min AND :max")
    List<Book> searchByPrice(float min, float max);


}
