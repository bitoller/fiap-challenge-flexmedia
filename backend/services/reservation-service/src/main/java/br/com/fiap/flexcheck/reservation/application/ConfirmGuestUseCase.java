package br.com.fiap.flexcheck.reservation.application;

import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;

public interface ConfirmGuestUseCase {
    void execute(Long reservationId, GuestConfirmationCommand command);
}
