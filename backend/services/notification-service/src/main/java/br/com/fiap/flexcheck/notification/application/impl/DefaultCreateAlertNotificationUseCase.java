package br.com.fiap.flexcheck.notification.application.impl;

import br.com.fiap.flexcheck.notification.application.CreateAlertNotificationUseCase;
import br.com.fiap.flexcheck.notification.application.command.CreateAlertNotificationCommand;
import br.com.fiap.flexcheck.notification.infrastructure.repository.InMemoryNotificationRepository;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCreateAlertNotificationUseCase implements CreateAlertNotificationUseCase {
    private final InMemoryNotificationRepository notificationRepository;

    public DefaultCreateAlertNotificationUseCase(InMemoryNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationResult execute(CreateAlertNotificationCommand command) {
        return notificationRepository.createAlert(command);
    }
}
