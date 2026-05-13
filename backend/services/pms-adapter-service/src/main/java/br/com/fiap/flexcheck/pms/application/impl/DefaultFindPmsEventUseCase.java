package br.com.fiap.flexcheck.pms.application.impl;

import br.com.fiap.flexcheck.pms.application.FindPmsEventUseCase;
import br.com.fiap.flexcheck.pms.infrastructure.repository.PmsEventRepository;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultFindPmsEventUseCase implements FindPmsEventUseCase {
    private final PmsEventRepository pmsEventRepository;

    public DefaultFindPmsEventUseCase(PmsEventRepository pmsEventRepository) {
        this.pmsEventRepository = pmsEventRepository;
    }

    @Override
    public PmsEventResult execute(Long eventId) {
        return pmsEventRepository.findById(eventId);
    }
}
