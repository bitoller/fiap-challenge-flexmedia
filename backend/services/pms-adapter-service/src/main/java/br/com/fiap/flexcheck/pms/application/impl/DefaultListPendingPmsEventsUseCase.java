package br.com.fiap.flexcheck.pms.application.impl;

import br.com.fiap.flexcheck.pms.application.ListPendingPmsEventsUseCase;
import br.com.fiap.flexcheck.pms.infrastructure.repository.PmsEventRepository;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListPendingPmsEventsUseCase implements ListPendingPmsEventsUseCase {
    private final PmsEventRepository pmsEventRepository;

    public DefaultListPendingPmsEventsUseCase(PmsEventRepository pmsEventRepository) {
        this.pmsEventRepository = pmsEventRepository;
    }

    @Override
    public List<PmsEventResult> execute() {
        return pmsEventRepository.findPending();
    }
}
