package br.com.fiap.flexcheck.biometry.application.command;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record BiometryVerificationCommand(
        @NotNull Long sessionId,
        @NotNull Long guestId,
        Boolean consentGranted,
        String requestedStatus,
        BigDecimal confidence,
        String templateReference
) {
}
