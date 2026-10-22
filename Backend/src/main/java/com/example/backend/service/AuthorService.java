package com.example.backend.service;

import com.example.backend.dto.AuthorDto.AuthorRequestDto;
import com.example.backend.dto.AuthorDto.AuthorResponseDto;
import com.example.backend.model.Author;
import com.example.backend.repository.AuthorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuthorService {

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public AuthorResponseDto createAuthor(AuthorRequestDto dto) {

        Author author = new Author();
        author.setFirstName(dto.getFirstName());
        author.setLastName(dto.getLastName());

        Author savedAuthor = authorRepository.save(author);

        return new AuthorResponseDto(
                savedAuthor.getId(),
                savedAuthor.getFirstName(),
                savedAuthor.getLastName()
        );
    }

    @Transactional(readOnly = true)
    public List<AuthorResponseDto> getAllAuthors() {
        return authorRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AuthorResponseDto getAuthorById(UUID authorId) {
        Author author = findAuthorOrThrow(authorId);
        return mapToResponseDto(author);

    }

    public AuthorResponseDto updateAuthor(UUID authorId, AuthorRequestDto dto) {
        Author author = findAuthorOrThrow(authorId);

        author.setFirstName(dto.getFirstName());
        author.setLastName(dto.getLastName());

        Author updatedAuthor = authorRepository.save(author);
        return mapToResponseDto(updatedAuthor);
    }

    public void deleteAuthor(UUID authorId) {
        Author author = findAuthorOrThrow(authorId);
        authorRepository.delete(author);
    }

    private Author findAuthorOrThrow(UUID authorId) {
        return authorRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("Authot not found"));
    }

    private AuthorResponseDto mapToResponseDto(Author author) {
        return new AuthorResponseDto(
                author.getId(),
                author.getFirstName(),
                author.getLastName()
        );
    }
}
