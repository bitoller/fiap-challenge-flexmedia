package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HttpReservationServiceClient implements ReservationServiceClient {
    private final RestClient restClient;

    public HttpReservationServiceClient(@Value("${services.reservation.url:http://localhost:8082}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public ReservationResult search(String type, String value) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/api/v1/reservations/search")
                        .queryParam("type", type)
                        .queryParam("value", value)
                        .build())
                .retrieve()
                .body(ReservationResult.class);
    }

    @Override
    public ReservationResult findById(Long reservationId) {
        return restClient.get()
                .uri("/api/v1/reservations/{reservationId}", reservationId)
                .retrieve()
                .body(ReservationResult.class);
    }

    @Override
    public void confirmGuest(Long reservationId, GuestConfirmationCommand command) {
        restClient.post()
                .uri("/api/v1/reservations/{reservationId}/guest-confirmation", reservationId)
                .body(command)
                .retrieve()
                .toBodilessEntity();
    }
}
