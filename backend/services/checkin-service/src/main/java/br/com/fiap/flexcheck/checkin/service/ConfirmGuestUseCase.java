package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;

public interface ConfirmGuestUseCase {
    void execute(Long sessionId, GuestConfirmationCommand command);
}
