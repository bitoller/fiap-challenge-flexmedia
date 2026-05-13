package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;

public interface RegisterConsentsUseCase {
    void execute(Long sessionId, ConsentCommand command);
}
