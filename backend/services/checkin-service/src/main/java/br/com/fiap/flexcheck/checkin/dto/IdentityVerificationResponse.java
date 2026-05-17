package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;

public record IdentityVerificationResponse(
        Long sessionId,
        String status,
        String documentStatus,
        String biometryStatus,
        String provider,
        BigDecimal score,
        boolean canContinue,
        boolean fallbackUsed,
        String message
) {
}
