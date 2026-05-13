package br.com.fiap.flexcheck.pms.application;

import br.com.fiap.flexcheck.pms.application.command.PmsEventCommand;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;

public interface RecordPmsEventUseCase {
    PmsEventResult execute(PmsEventCommand command);
}
