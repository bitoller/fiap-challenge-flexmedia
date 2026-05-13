package br.com.fiap.flexcheck.reservation.application;

import br.com.fiap.flexcheck.reservation.application.command.CreateReservationCommand;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;

public interface CreateReservationUseCase {
    ReservationResult execute(CreateReservationCommand command);
}
