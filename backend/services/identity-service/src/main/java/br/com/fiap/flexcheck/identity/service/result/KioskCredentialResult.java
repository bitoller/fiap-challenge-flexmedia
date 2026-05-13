package br.com.fiap.flexcheck.identity.service.result;

import java.time.LocalDateTime;

public record KioskCredentialResult(
        Long id,
        Long hotelId,
        String kioskCode,
        String kioskName,
        String accessToken,
        LocalDateTime issuedAt,
        LocalDateTime expiresAt,
        boolean active
) {
}
