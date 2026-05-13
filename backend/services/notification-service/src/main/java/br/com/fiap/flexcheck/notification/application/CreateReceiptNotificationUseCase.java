package br.com.fiap.flexcheck.notification.application;

import br.com.fiap.flexcheck.notification.application.command.CreateReceiptNotificationCommand;
import br.com.fiap.flexcheck.notification.service.result.NotificationResult;

public interface CreateReceiptNotificationUseCase {
    NotificationResult execute(CreateReceiptNotificationCommand command);
}
