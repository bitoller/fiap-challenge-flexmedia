package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;

public interface CreateSessionUseCase {
    SessionResult execute(CreateSessionCommand command);
}
