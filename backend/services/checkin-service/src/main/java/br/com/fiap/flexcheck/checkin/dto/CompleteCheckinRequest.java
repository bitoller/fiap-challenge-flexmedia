package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;

public record CompleteCheckinRequest(
        @NotBlank String paymentMethod,
        @NotBlank String keyType,
        String documentStatus,
        String biometryStatus
) {
}
