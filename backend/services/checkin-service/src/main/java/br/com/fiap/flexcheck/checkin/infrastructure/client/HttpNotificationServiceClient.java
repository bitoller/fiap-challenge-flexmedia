package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.NotificationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class HttpNotificationServiceClient implements NotificationServiceClient {
    private final RestClient restClient;

    public HttpNotificationServiceClient(@Value("${services.notification.url:http://localhost:8091}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public NotificationResult sendReceipt(String recipient, String subject, String message, String relatedResourceType, String relatedResourceId) {
        return restClient.post()
                .uri("/api/v1/notifications/receipts")
                .body(Map.of(
                        "channel", "IN_APP",
                        "recipient", recipient,
                        "subject", subject,
                        "message", message,
                        "relatedResourceType", relatedResourceType,
                        "relatedResourceId", relatedResourceId
                ))
                .retrieve()
                .body(NotificationResult.class);
    }

    @Override
    public NotificationResult sendAlert(String recipient, String subject, String message, String relatedResourceType, String relatedResourceId) {
        return restClient.post()
                .uri("/api/v1/notifications/alerts")
                .body(Map.of(
                        "channel", "IN_APP",
                        "recipient", recipient,
                        "subject", subject,
                        "message", message,
                        "relatedResourceType", relatedResourceType,
                        "relatedResourceId", relatedResourceId
                ))
                .retrieve()
                .body(NotificationResult.class);
    }
}
