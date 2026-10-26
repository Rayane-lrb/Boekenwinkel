package com.example.backend.controller;

import com.example.backend.dto.BookDto.BookRequestDto;
import com.example.backend.dto.BookDto.BookResponseDto;
import com.example.backend.model.Book;
import com.example.backend.service.BookService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/books")
public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<Iterable<BookResponseDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{isbn}")
    public ResponseEntity<BookResponseDto> getSnackById(@PathVariable String isbn) {
        BookResponseDto book = bookService.getBookByIsbn(isbn);
        return ResponseEntity.ok(book);
    }

    @PostMapping
    public ResponseEntity<BookResponseDto> addBook(@RequestBody BookRequestDto dto) {
        BookResponseDto book = bookService.createBook(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(book);
    }

    @PutMapping
    public ResponseEntity<BookResponseDto> editBook(@RequestBody BookRequestDto dto) {
        BookResponseDto updatedBook = bookService.updateBook(dto);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteBook(@PathVariable String isbn) {
        bookService.deleteBook(isbn);
        return ResponseEntity.ok("Delete book successfully");
    }
}
