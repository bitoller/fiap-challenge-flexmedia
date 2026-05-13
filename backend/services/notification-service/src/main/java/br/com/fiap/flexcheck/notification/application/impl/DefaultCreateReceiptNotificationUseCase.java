package br.com.fiap.flexcheck.notification.application.impl;

import br.com.fiap.flexcheck.notification.application.CreateReceiptNotificationUseCase;
import br.com.fiap.flexcheck.notification.application.command.CreateReceiptNotificationCommand;
import br.com.fiap.flexcheck.notification.infrastructure.repository.InMemoryNotificationRepository;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCreateReceiptNotificationUseCase implements CreateReceiptNotificationUseCase {
    private final InMemoryNotificationRepository notificationRepository;

    public DefaultCreateReceiptNotificationUseCase(InMemoryNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationResult execute(CreateReceiptNotificationCommand command) {
        return notificationRepository.createReceipt(command);
    }
}
