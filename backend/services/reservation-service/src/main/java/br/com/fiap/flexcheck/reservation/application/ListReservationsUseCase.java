package br.com.fiap.flexcheck.reservation.application;

import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;

import java.util.List;

public interface ListReservationsUseCase {
    List<ReservationResult> execute(Long hotelId);
}
