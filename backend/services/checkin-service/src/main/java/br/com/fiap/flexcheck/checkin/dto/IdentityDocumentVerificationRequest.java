package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;

public record IdentityDocumentVerificationRequest(
        @NotBlank String imageBase64,
        String mimeType
) {
}
