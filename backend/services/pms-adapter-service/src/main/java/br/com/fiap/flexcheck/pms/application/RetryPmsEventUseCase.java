package br.com.fiap.flexcheck.pms.application;

import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;

public interface RetryPmsEventUseCase {
    PmsEventResult execute(Long eventId);
}
