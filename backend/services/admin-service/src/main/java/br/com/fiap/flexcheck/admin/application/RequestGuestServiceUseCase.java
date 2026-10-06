package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;

public interface RequestGuestServiceUseCase {
    void execute(GuestServiceRequestCommand command);
}
