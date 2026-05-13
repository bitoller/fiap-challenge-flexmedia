package br.com.fiap.flexcheck.pms.service.result;

import java.time.LocalDateTime;

public record PmsEventResult(
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
