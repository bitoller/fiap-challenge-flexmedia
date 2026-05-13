package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.BiometryVerificationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Service
public class HttpBiometryServiceClient implements BiometryServiceClient {
    private final RestClient restClient;

    public HttpBiometryServiceClient(@Value("${services.biometry.url:http://localhost:8086}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public BiometryVerificationResult recordVerification(Long sessionId, Long guestId, String requestedStatus) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("sessionId", sessionId);
        payload.put("guestId", guestId);
        payload.put("requestedStatus", requestedStatus);
        payload.put("consentGranted", !"SKIPPED".equalsIgnoreCase(requestedStatus));
        payload.put("templateReference", "BIO-" + sessionId);
        return restClient.post()
                .uri("/api/v1/biometry/verifications")
                .body(payload)
                .retrieve()
                .body(BiometryVerificationResult.class);
    }
}
