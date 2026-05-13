package br.com.fiap.flexcheck.checkin.domain.entity;

import java.time.LocalDateTime;

public record CheckinSession(
        Long id,
        String status,
        LocalDateTime expiresAt,
        String correlationId
) {
}

