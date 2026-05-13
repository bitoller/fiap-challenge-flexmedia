package br.com.fiap.flexcheck.checkin.service.result;

import java.time.LocalDateTime;

public record NotificationResult(
        Long id,
        String type,
        String channel,
        String status,
        String recipient,
        String subject,
        String message,
        String relatedResourceType,
        String relatedResourceId,
        LocalDateTime createdAt,
        LocalDateTime sentAt
) {
}
