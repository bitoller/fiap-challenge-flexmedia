package br.com.fiap.flexcheck.pms.infrastructure.repository;

import br.com.fiap.flexcheck.pms.application.command.PmsEventCommand;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;

import java.util.List;

public interface PmsEventRepository {
    PmsEventResult recordEvent(PmsEventCommand command);

    PmsEventResult findById(Long eventId);

    List<PmsEventResult> findPending();

    PmsEventResult retry(Long eventId);
}
