package br.com.fiap.flexcheck.notification.application;

import br.com.fiap.flexcheck.notification.service.result.NotificationResult;

import java.util.List;

public interface ListNotificationsUseCase {
    List<NotificationResult> execute();
}
