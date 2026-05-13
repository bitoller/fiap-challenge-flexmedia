package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.PaymentResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class HttpPaymentServiceClient implements PaymentServiceClient {
    private final RestClient restClient;

    public HttpPaymentServiceClient(@Value("${services.payment.url:http://localhost:8083}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public PaymentResult recordPayment(Long stayId, Long reservationId, String type, String status, BigDecimal amount, String authorizationCode) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("stayId", stayId);
        payload.put("reservationId", reservationId);
        payload.put("transactionType", type);
        payload.put("status", status);
        payload.put("amount", amount);
        payload.put("authorizationCode", authorizationCode);
        return restClient.post()
                .uri("/api/v1/payments/transactions")
                .body(payload)
                .retrieve()
                .body(PaymentResult.class);
    }
}
