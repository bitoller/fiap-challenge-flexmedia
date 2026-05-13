package br.com.fiap.flexcheck.checkin.domain.entity;

import java.time.LocalDateTime;

public record KeyCredential(
        Long id,
        String type,
        String status,
        String value,
        LocalDateTime expiresAt
) {
}

