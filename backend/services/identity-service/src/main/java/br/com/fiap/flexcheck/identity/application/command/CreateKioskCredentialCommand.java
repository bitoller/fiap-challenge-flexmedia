package br.com.fiap.flexcheck.identity.application.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateKioskCredentialCommand(
        @NotNull @Positive Long hotelId,
        @NotBlank String kioskCode,
        @NotBlank String kioskName
) {
}
