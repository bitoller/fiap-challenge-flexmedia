package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.infrastructure.client.DashboardServiceClient;
import br.com.fiap.flexcheck.checkin.service.DashboardUseCase;
import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultDashboardUseCase implements DashboardUseCase {
    private final DashboardServiceClient dashboardServiceClient;

    public DefaultDashboardUseCase(DashboardServiceClient dashboardServiceClient) {
        this.dashboardServiceClient = dashboardServiceClient;
    }

    @Override
    public DashboardResult execute() {
        return dashboardServiceClient.loadDashboard();
    }
}
