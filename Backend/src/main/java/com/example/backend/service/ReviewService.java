package com.example.backend.service;

import com.example.backend.dto.ReviewDto.ReviewRequestDto;
import com.example.backend.dto.ReviewDto.ReviewResponseDto;
import com.example.backend.model.Book;
import com.example.backend.model.Review;
import com.example.backend.model.User;
import com.example.backend.repository.BookRepository;
import com.example.backend.repository.ReviewRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReviewService {

      private final UserRepository userRepository;
      private final BookRepository bookRepository;
      private final ReviewRepository reviewRepository;

    public ReviewService(UserRepository userRepository, BookRepository bookRepository, ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    public ReviewResponseDto createReview(String isbn, ReviewRequestDto dto) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(currentEmail);
        Book book = bookRepository.findById(isbn).orElse(null);

        if(currentUser == null) {
            throw new RuntimeException("Signed in user not found");
        }

        if(book == null) {
            throw new RuntimeException("Book not found");
        }

        Review review = new Review();
        review.setScore(dto.getScore());
        review.setText(dto.getText());
        review.setBook(book);
        review.setCreatedAt(LocalDateTime.now());
        review.setUser(currentUser);
        Review savedReview = reviewRepository.save(review);

        return mapToResponseDto(savedReview);

    }
    @Transactional(readOnly = true)
    public List<ReviewResponseDto> getAllReviews() {
        return reviewRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .toList();
    }
    @Transactional(readOnly = true)
    public ReviewResponseDto getReviewById(UUID reviewId) {
        Review review = findReviewOrThrow(reviewId);
        return mapToResponseDto(review);
    }

    public void deleteReview(UUID reviewId) {
        Review review = findReviewOrThrow(reviewId);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        if (!isAdmin && !review.getUser().getEmail().equals(authentication.getName())) {
            throw new AccessDeniedException("You are not allowed to delete this review");
        }
        reviewRepository.delete(review);

    }

    private ReviewResponseDto mapToResponseDto(Review review) {
        return new ReviewResponseDto(
                review.getId(),
                review.getScore(),
                review.getText(),
                review.getCreatedAt(),
                review.getUser().getEmail(),
                review.getBook().getIsbn()
        );
    }

    private Review findReviewOrThrow(UUID reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
    }
}
