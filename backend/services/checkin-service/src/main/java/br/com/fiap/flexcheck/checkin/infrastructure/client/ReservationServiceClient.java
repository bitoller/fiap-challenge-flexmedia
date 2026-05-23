package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;

public interface ReservationServiceClient {
    ReservationResult search(Long hotelId, String type, String value);

    default ReservationResult search(String type, String value) {
        return search(null, type, value);
    }

    ReservationResult findById(Long reservationId);

    void confirmGuest(Long reservationId, GuestConfirmationCommand command);
}
