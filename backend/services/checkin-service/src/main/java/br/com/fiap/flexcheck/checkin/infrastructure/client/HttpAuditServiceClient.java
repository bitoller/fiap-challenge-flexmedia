package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HttpAuditServiceClient implements AuditServiceClient {
    private final RestClient restClient;

    public HttpAuditServiceClient(@Value("${services.admin.url:http://localhost:8085}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public void record(AuditEvent event) {
        restClient.post()
                .uri("/api/v1/admin/audit-events")
                .body(event)
                .retrieve()
                .toBodilessEntity();
    }
}
