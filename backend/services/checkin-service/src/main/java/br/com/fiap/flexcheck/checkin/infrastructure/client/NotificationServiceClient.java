package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.NotificationResult;

public interface NotificationServiceClient {
    NotificationResult sendReceipt(String recipient, String subject, String message, String relatedResourceType, String relatedResourceId);

    NotificationResult sendAlert(String recipient, String subject, String message, String relatedResourceType, String relatedResourceId);
}
