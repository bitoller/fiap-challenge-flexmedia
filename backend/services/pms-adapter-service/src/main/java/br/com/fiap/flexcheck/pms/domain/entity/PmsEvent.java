package br.com.fiap.flexcheck.pms.domain.entity;

import java.time.LocalDateTime;

public record PmsEvent(
        Long id,
        Long reservationId,
        String eventType,
        String status,
        String payload,
        Integer attempts,
        LocalDateTime lastAttemptAt,
        LocalDateTime createdAt
) {
}
