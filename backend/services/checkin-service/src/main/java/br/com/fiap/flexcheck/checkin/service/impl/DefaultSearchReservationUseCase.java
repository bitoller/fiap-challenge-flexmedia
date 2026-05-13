package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.service.SearchReservationUseCase;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultSearchReservationUseCase implements SearchReservationUseCase {
    private final ReservationServiceClient reservationServiceClient;

    public DefaultSearchReservationUseCase(ReservationServiceClient reservationServiceClient) {
        this.reservationServiceClient = reservationServiceClient;
    }

    @Override
    public ReservationResult execute(String type, String value) {
        return reservationServiceClient.search(type, value);
    }

    @Override
    public ReservationResult findById(Long reservationId) {
        return reservationServiceClient.findById(reservationId);
    }
}
