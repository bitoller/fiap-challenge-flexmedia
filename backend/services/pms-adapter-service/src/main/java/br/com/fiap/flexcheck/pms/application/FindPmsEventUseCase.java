package br.com.fiap.flexcheck.pms.application;

import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;

public interface FindPmsEventUseCase {
    PmsEventResult execute(Long eventId);
}
