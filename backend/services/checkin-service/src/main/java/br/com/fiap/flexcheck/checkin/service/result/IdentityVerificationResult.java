package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;

public record IdentityVerificationResult(
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
