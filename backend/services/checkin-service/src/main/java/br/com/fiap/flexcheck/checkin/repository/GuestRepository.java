package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;

public interface GuestRepository {
    void updateGuest(GuestConfirmationCommand command);
}

