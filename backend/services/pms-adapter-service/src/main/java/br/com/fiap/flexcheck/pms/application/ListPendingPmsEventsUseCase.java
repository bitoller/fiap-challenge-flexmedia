package br.com.fiap.flexcheck.pms.application;

import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;

import java.util.List;

public interface ListPendingPmsEventsUseCase {
    List<PmsEventResult> execute();
}
