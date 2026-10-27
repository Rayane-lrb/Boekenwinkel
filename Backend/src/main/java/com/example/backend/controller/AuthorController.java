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
    public ResponseEntity<AuthorResponseDto> getAuthorById(@PathVariable UUID id) {
        AuthorResponseDto author = authorService.getAuthorById(id);
        return ResponseEntity.ok(author);
    }

    @PostMapping
    public ResponseEntity<AuthorResponseDto> addAuthor(@RequestBody AuthorRequestDto dto) {
        AuthorResponseDto author = authorService.createAuthor(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(author);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AuthorResponseDto> editAuthor(@PathVariable UUID id, @RequestBody AuthorRequestDto dto) {
        AuthorResponseDto updatedAuthor = authorService.updateAuthor(id, dto);
        return ResponseEntity.ok(updatedAuthor);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuthor(@PathVariable UUID id) {
        authorService.deleteAuthor(id);
        return ResponseEntity.ok("Deleted author successfully");
    }

}
