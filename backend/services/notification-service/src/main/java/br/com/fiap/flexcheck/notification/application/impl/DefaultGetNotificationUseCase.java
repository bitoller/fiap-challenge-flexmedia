package br.com.fiap.flexcheck.notification.application.impl;

import br.com.fiap.flexcheck.notification.application.GetNotificationUseCase;
import br.com.fiap.flexcheck.notification.infrastructure.repository.InMemoryNotificationRepository;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class DefaultGetNotificationUseCase implements GetNotificationUseCase {
    private final InMemoryNotificationRepository notificationRepository;

    public DefaultGetNotificationUseCase(InMemoryNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationResult execute(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Notification not found: " + notificationId));
    }
}
