package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;

public interface CompleteCheckinUseCase {
    CompleteCheckinResult execute(Long sessionId, CompleteCheckinCommand command);
}
