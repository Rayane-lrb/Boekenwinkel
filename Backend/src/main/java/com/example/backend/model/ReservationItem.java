package com.example.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.UUID;

@Entity
public class ReservationItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;


}
