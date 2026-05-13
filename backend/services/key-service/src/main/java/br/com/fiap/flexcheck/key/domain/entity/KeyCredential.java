package br.com.fiap.flexcheck.key.domain.entity;

import java.time.LocalDateTime;

public record KeyCredential(
        Long id,
        Long stayId,
        Long roomId,
        String type,
        String status,
        String value,
        LocalDateTime issuedAt,
        LocalDateTime expiresAt
) {
}
