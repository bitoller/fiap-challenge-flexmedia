package br.com.fiap.flexcheck.checkin.service.identity;

import java.math.BigDecimal;

public record FaceMatchProviderResult(
        String status,
        String provider,
        BigDecimal score,
        String referenceCode,
        String message
) {
}
