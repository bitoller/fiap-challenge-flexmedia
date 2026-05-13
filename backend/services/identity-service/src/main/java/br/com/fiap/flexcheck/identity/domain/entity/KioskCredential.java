package br.com.fiap.flexcheck.identity.domain.entity;

import java.time.LocalDateTime;

public record KioskCredential(
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
