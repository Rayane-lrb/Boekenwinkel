package com.example.backend.service;

import com.example.backend.dto.BookDto.BookRequestDto;
import com.example.backend.dto.BookDto.BookResponseDto;
import com.example.backend.model.Author;
import com.example.backend.model.Book;
import com.example.backend.repository.AuthorRepository;
import com.example.backend.repository.BookRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class BookService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public BookService(AuthorRepository authorRepository, BookRepository bookRepository) {
        this.authorRepository = authorRepository;
        this.bookRepository = bookRepository;
    }

    public BookResponseDto createBook(BookRequestDto dto) {
        Author author = findAuthorOrThrow(dto.getAuthorId());

        if (bookRepository.existsById(dto.getIsbn())) {
            throw new RuntimeException("A book with this isbn already exists");
        }

        Book book = new Book();
        book.setIsbn(dto.getIsbn());
        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        book.setStock(dto.getStock());
        book.setAuthors(List.of(author));

        Book savedBook = bookRepository.save(book);

        return new BookResponseDto(
                savedBook.getIsbn(),
                savedBook.getTitle(),
                savedBook.getDescription(),
                savedBook.getPrice(),
                savedBook.getStock(),
                author.getFirstName(),
                author.getLastName()
        );
    }

    @Transactional(readOnly = true)
    public List<BookResponseDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public BookResponseDto getBookByIsbn(String isbn) {
        Book book = findBookOrThrow(isbn);
        return mapToResponseDto(book);
    }

    public BookResponseDto updateBook(String isbn, BookRequestDto dto) {
        Book book = findBookOrThrow(isbn);

        Author author = findAuthorOrThrow(dto.getAuthorId());

        book.setTitle(dto.getTitle());
        book.setDescription(dto.getDescription());
        book.setPrice(dto.getPrice());
        book.setStock(dto.getStock());
        book.setAuthors(List.of(author));

        Book updatedBook = bookRepository.save(book);
        return mapToResponseDto(updatedBook);
    }

    public void deleteBook(String isbn) {
        Book book = findBookOrThrow(isbn);
        bookRepository.delete(book);
    }

    private Author findAuthorOrThrow(UUID authorId) {
        return authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Author not found"));
    }

    private Book findBookOrThrow(String isbn) {
        return bookRepository.findById(isbn)
                .orElseThrow(() -> new RuntimeException("Book isbn not found"));
    }

    private BookResponseDto mapToResponseDto(Book book) {
        Author author = book.getAuthors().isEmpty() ? null : book.getAuthors().get(0);

        return new BookResponseDto(
                book.getIsbn(),
                book.getTitle(),
                book.getDescription(),
                book.getPrice(),
                book.getStock(),
                author != null ? author.getFirstName() : "Unknown",
                author != null ? author.getLastName() : "Unknown"
        );
    }

}
