package br.com.fiap.flexcheck.notification.application.impl;

import br.com.fiap.flexcheck.notification.application.ListNotificationsUseCase;
import br.com.fiap.flexcheck.notification.infrastructure.repository.InMemoryNotificationRepository;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListNotificationsUseCase implements ListNotificationsUseCase {
    private final InMemoryNotificationRepository notificationRepository;

    public DefaultListNotificationsUseCase(InMemoryNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public List<NotificationResult> execute() {
        return notificationRepository.list();
    }
}
