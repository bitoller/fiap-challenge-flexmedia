package br.com.fiap.flexcheck.notification.infrastructure.repository;

import br.com.fiap.flexcheck.notification.application.command.CreateAlertNotificationCommand;
import br.com.fiap.flexcheck.notification.application.command.CreateReceiptNotificationCommand;
import br.com.fiap.flexcheck.notification.domain.entity.NotificationRecord;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryNotificationRepository {
    private final AtomicLong sequence = new AtomicLong(1L);
    private final List<NotificationRecord> notifications = new CopyOnWriteArrayList<>();

    public NotificationResult createReceipt(CreateReceiptNotificationCommand command) {
        return store("RECEIPT", "SENT", command.channel(), command.recipient(), command.subject(), command.message(), command.relatedResourceType(), command.relatedResourceId());
    }

    public NotificationResult createAlert(CreateAlertNotificationCommand command) {
        return store("ALERT", "SENT", command.channel(), command.recipient(), command.subject(), command.message(), command.relatedResourceType(), command.relatedResourceId());
    }

    public List<NotificationResult> list() {
        return notifications.stream().map(this::toResult).toList();
    }

    public Optional<NotificationResult> findById(Long id) {
        return notifications.stream()
                .filter(notification -> notification.id().equals(id))
                .findFirst()
                .map(this::toResult);
    }

    private NotificationResult store(String type, String status, String channel, String recipient, String subject, String message, String relatedResourceType, String relatedResourceId) {
        LocalDateTime now = LocalDateTime.now();
        NotificationRecord record = new NotificationRecord(
                sequence.getAndIncrement(),
                type,
                channel,
                status,
                recipient,
                subject,
                message,
                relatedResourceType,
                relatedResourceId,
                now,
                now
        );
        notifications.add(record);
        return toResult(record);
    }

    private NotificationResult toResult(NotificationRecord record) {
        return new NotificationResult(
                record.id(),
                record.type(),
                record.channel(),
                record.status(),
                record.recipient(),
                record.subject(),
                record.message(),
                record.relatedResourceType(),
                record.relatedResourceId(),
                record.createdAt(),
                record.sentAt()
        );
    }
}
