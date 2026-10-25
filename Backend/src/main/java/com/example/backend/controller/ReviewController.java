package com.example.backend.controller;

import com.example.backend.dto.ReviewDto.ReviewRequestDto;
import com.example.backend.dto.ReviewDto.ReviewResponseDto;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<Iterable<ReviewResponseDto>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponseDto> getReviewById(@RequestParam UUID reviewId) {
        ReviewResponseDto review = reviewService.getReviewById(reviewId);
        return ResponseEntity.ok(review);
    }
    @PostMapping
    public ResponseEntity<ReviewResponseDto> addReview(@RequestParam String isbn, @RequestParam ReviewRequestDto dto) {
        ReviewResponseDto review = reviewService.createReview(isbn, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReview(@RequestParam UUID reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
