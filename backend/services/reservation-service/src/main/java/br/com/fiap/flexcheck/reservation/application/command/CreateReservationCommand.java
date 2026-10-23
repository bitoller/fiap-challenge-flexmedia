package br.com.fiap.flexcheck.reservation.application.command;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateReservationCommand(
        @NotNull Long hotelId,
        @NotBlank String hotelName,
        @NotBlank String roomNumber,
        @NotBlank String roomType,
        @NotBlank
        @Pattern(regexp = "^RSV-\\d{4}-\\d{4}$", message = "must use the format RSV-YYYY-NNNN")
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
