package br.com.fiap.flexcheck.biometry.application.command;

import jakarta.validation.constraints.NotBlank;

public record BiometryReviewCommand(
        @NotBlank String status
) {
}
