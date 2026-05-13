package br.com.fiap.flexcheck.reservation.controller;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateReservationRequest(
        @NotBlank String hotelName,
        @NotBlank String roomNumber,
        @NotBlank String roomType,
        String reservationCode,
        @NotNull LocalDate arrivalDate,
        @NotNull LocalDate departureDate,
        @Positive int adults,
        @PositiveOrZero int children,
        @NotNull BigDecimal totalAmount,
        @NotBlank String currency,
        @NotBlank String guestFullName,
        @NotBlank String guestDocumentType,
        @NotBlank String guestDocumentNumber,
        LocalDate guestBirthDate,
        String guestNationality,
        @Email String guestEmail,
        String guestPhone
) {
}
