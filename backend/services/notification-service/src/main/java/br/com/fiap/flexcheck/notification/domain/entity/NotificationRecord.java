package br.com.fiap.flexcheck.notification.domain.entity;

import java.time.LocalDateTime;

public record NotificationRecord(
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
