package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;

public interface SearchReservationUseCase {
    ReservationResult execute(String type, String value);
}
