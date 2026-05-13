package br.com.fiap.flexcheck.pms.application.impl;

import br.com.fiap.flexcheck.pms.application.RetryPmsEventUseCase;
import br.com.fiap.flexcheck.pms.infrastructure.repository.PmsEventRepository;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRetryPmsEventUseCase implements RetryPmsEventUseCase {
    private final PmsEventRepository pmsEventRepository;

    public DefaultRetryPmsEventUseCase(PmsEventRepository pmsEventRepository) {
        this.pmsEventRepository = pmsEventRepository;
    }

    @Override
    public PmsEventResult execute(Long eventId) {
        return pmsEventRepository.retry(eventId);
    }
}
