package com.example.backend.repository;

import com.example.backend.model.ReservationItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ReservationItemRepository extends JpaRepository<ReservationItem, UUID> {
}
