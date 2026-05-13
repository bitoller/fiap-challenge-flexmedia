package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record GuestConfirmationRequest(
        @NotNull @Positive Long guestId,
        @NotBlank String fullName,
        @NotBlank String documentType,
        @NotBlank String documentNumber,
        @NotNull LocalDate birthDate,
        @Email String email,
        String phone
) {
}
