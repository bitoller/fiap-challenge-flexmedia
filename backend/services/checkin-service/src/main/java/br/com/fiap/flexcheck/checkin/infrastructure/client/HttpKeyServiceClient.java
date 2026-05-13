package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.KeyResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.Map;

@Service
public class HttpKeyServiceClient implements KeyServiceClient {
    private final RestClient restClient;

    public HttpKeyServiceClient(@Value("${services.key.url:http://localhost:8084}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public KeyResult issueKey(Long stayId, Long roomId, String keyType, LocalDate departureDate) {
        return restClient.post()
                .uri("/api/v1/keys/issue")
                .body(Map.of(
                        "stayId", stayId,
                        "roomId", roomId,
                        "keyType", keyType,
                        "departureDate", departureDate
                ))
                .retrieve()
                .body(KeyResult.class);
    }

    @Override
    public void revokeKeys(Long stayId) {
        restClient.post()
                .uri("/api/v1/keys/{stayId}/revoke", stayId)
                .retrieve()
                .toBodilessEntity();
    }
}
