package br.com.fiap.flexcheck.reservation.application;

import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;

public interface SearchReservationUseCase {
    ReservationResult execute(String type, String value);

    ReservationResult findById(Long reservationId);
}
