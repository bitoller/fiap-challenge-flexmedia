package br.com.fiap.flexcheck.checkin.infrastructure.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class HttpPmsAdapterServiceClient implements PmsAdapterServiceClient {
    private final RestClient restClient;

    public HttpPmsAdapterServiceClient(@Value("${services.pms.url:http://localhost:8087}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public void syncCheckin(Long reservationId, Long stayId, Long roomId, String roomNumber, String guestName, BigDecimal totalAmount) {
        restClient.post()
                .uri("/api/v1/pms/checkins")
                .body(buildPayload(reservationId, stayId, roomId, roomNumber, guestName, totalAmount))
                .retrieve()
                .toBodilessEntity();
    }

    @Override
    public void syncCheckout(Long reservationId, Long stayId, Long roomId, BigDecimal totalAmount) {
        restClient.post()
                .uri("/api/v1/pms/checkouts")
                .body(buildPayload(reservationId, stayId, roomId, null, null, totalAmount))
                .retrieve()
                .toBodilessEntity();
    }

    private Map<String, Object> buildPayload(
            Long reservationId,
            Long stayId,
            Long roomId,
            String roomNumber,
            String guestName,
            BigDecimal totalAmount
    ) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("stayId", stayId);
        payload.put("roomId", roomId);
        payload.put("roomNumber", roomNumber);
        if (guestName != null) {
            payload.put("guestName", guestName);
        }
        payload.put("totalAmount", totalAmount);
        return Map.of(
                "reservationId", reservationId,
                "status", "SENT",
                "payload", payload
        );
    }
}
