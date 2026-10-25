package com.example.backend.controller;

import com.example.backend.dto.AuthorDto.AuthorRequestDto;
import com.example.backend.dto.AuthorDto.AuthorResponseDto;
import com.example.backend.service.AuthorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    private AuthorService authorService;

    @Autowired
    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @GetMapping
    public ResponseEntity<Iterable<AuthorResponseDto>> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponseDto> getAuthorById(UUID authorId) {
        AuthorResponseDto author = authorService.getAuthorById(authorId);
        return ResponseEntity.ok(author);
    }

    @PostMapping
    public ResponseEntity<AuthorResponseDto> addAuthor(AuthorRequestDto dto) {
        AuthorResponseDto author = authorService.createAuthor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(author);
    }

    @PutMapping
    public ResponseEntity<AuthorResponseDto> editAuthor(UUID authorId, AuthorRequestDto dto) {
        AuthorResponseDto updatedAuthor = authorService.updateAuthor(authorId, dto);
        return ResponseEntity.ok(updatedAuthor);
    }

    @DeleteMapping
    public ResponseEntity<String> deleteAuthor(UUID userId) {
        authorService.deleteAuthor(userId);
        return ResponseEntity.ok("Deleted author successfully");
    }

}
