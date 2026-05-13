package br.com.fiap.flexcheck.checkin.service.result;

import java.time.LocalDateTime;

public record SessionResult(
        Long sessionId,
        String status,
        LocalDateTime expiresAt,
        String correlationId
) {
}

