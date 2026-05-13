package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.mapper.ResultMapper;
import br.com.fiap.flexcheck.checkin.repository.DashboardRepository;
import br.com.fiap.flexcheck.checkin.service.DashboardUseCase;
import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultDashboardUseCase implements DashboardUseCase {
    private final DashboardRepository dashboardRepository;

    public DefaultDashboardUseCase(DashboardRepository dashboardRepository) {
        this.dashboardRepository = dashboardRepository;
    }

    @Override
    public DashboardResult execute() {
        return ResultMapper.toDashboardResult(dashboardRepository.dashboard());
    }
}
