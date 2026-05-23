package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class HttpReservationServiceClient implements ReservationServiceClient {
    private final RestClient restClient;

    public HttpReservationServiceClient(@Value("${services.reservation.url:http://localhost:8082}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public ReservationResult search(Long hotelId, String type, String value) {
        try {
            return restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/api/v1/reservations/search")
                            .queryParamIfPresent("hotelId", java.util.Optional.ofNullable(hotelId))
                            .queryParam("type", type)
                            .queryParam("value", value)
                            .build())
                    .retrieve()
                    .body(ReservationResult.class);
        } catch (RestClientException exception) {
            if (exception instanceof org.springframework.web.client.RestClientResponseException responseException
                    && responseException.getStatusCode().value() == 404) {
                throw new br.com.fiap.flexcheck.checkin.domain.exception.BusinessException(
                        "RESERVATION_NOT_FOUND",
                        "Reservation not found.",
                        404
                );
            }
            throw new br.com.fiap.flexcheck.checkin.domain.exception.BusinessException(
                    "RESERVATION_SERVICE_ERROR",
                    "Reservation service is temporarily unavailable.",
                    503
            );
        }
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
