package br.com.fiap.flexcheck.checkin.dto;

import java.time.LocalDateTime;

public record SessionResponse(
        Long sessionId,
        String status,
        LocalDateTime expiresAt,
        String correlationId
) {
}
