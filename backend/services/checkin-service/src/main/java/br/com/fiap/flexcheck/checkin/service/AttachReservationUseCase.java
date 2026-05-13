package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;

public interface AttachReservationUseCase {
    SessionReservationResult execute(Long sessionId, AttachReservationCommand command);
}
