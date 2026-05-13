package br.com.fiap.flexcheck.biometry.service.result;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BiometryVerificationResult(
        Long id,
        Long sessionId,
        Long guestId,
        String status,
        String provider,
        String templateReference,
        BigDecimal score,
        LocalDateTime verifiedAt
) {
}
