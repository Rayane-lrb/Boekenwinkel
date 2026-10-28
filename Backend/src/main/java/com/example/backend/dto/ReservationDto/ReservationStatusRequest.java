package com.example.backend.dto.ReservationDto;

import jakarta.validation.constraints.NotNull;

public record ReservationStatusRequest(
        @NotNull ReservationStatus status
) {
    public enum ReservationStatus {
        CONFIRMED,
        CANCELED
    }
}
