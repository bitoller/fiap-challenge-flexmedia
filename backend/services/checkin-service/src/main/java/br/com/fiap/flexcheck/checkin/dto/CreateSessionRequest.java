package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateSessionRequest(
        @NotNull @Positive Long kioskId,
        @NotBlank String flowType,
        String language
) {
}
