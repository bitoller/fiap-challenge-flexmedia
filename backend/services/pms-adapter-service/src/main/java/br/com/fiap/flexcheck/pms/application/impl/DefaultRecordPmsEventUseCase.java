package br.com.fiap.flexcheck.pms.application.impl;

import br.com.fiap.flexcheck.pms.application.RecordPmsEventUseCase;
import br.com.fiap.flexcheck.pms.application.command.PmsEventCommand;
import br.com.fiap.flexcheck.pms.infrastructure.repository.PmsEventRepository;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRecordPmsEventUseCase implements RecordPmsEventUseCase {
    private final PmsEventRepository pmsEventRepository;

    public DefaultRecordPmsEventUseCase(PmsEventRepository pmsEventRepository) {
        this.pmsEventRepository = pmsEventRepository;
    }

    @Override
    public PmsEventResult execute(PmsEventCommand command) {
        return pmsEventRepository.recordEvent(command);
    }
}
