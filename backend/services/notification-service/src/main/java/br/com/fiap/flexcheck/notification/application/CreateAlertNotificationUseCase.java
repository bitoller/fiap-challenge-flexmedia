package br.com.fiap.flexcheck.notification.application;

import br.com.fiap.flexcheck.notification.application.command.CreateAlertNotificationCommand;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;

public interface CreateAlertNotificationUseCase {
    NotificationResult execute(CreateAlertNotificationCommand command);
}
