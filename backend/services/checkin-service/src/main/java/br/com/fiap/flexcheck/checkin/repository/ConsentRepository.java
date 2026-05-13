package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;

public interface ConsentRepository {
    void saveConsent(Long sessionId, Long guestId, ConsentCommand.ConsentItemCommand item);
}

