package com.example.backend.repository;

import com.example.backend.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, String> {

    Book findByIsbnContainsIgnoreCase(String isbn);

    @Query("SELECT b FROM Book b WHERE b.price BETWEEN :min AND :max")
    List<Book> searchByPrice(float min, float max);

    @Modifying
    @Query("UPDATE Book b SET b.stock = b.stock - :quantity WHERE b.isbn = :isbn AND b.stock >= :quantity")
    int decrementStockIfAvailable(@Param("isbn") String isbn, @Param("quantity") int quantity);

}
