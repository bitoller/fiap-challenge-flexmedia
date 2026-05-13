package br.com.fiap.flexcheck.notification.application;

import br.com.fiap.flexcheck.notification.service.result.NotificationResult;

public interface GetNotificationUseCase {
    NotificationResult execute(Long notificationId);
}
