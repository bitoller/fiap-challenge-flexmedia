package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.ShowDashboardUseCase;
import br.com.fiap.flexcheck.admin.infrastructure.client.DeviceServiceClient;
import br.com.fiap.flexcheck.admin.infrastructure.repository.InMemoryDashboardRepository;
import br.com.fiap.flexcheck.admin.service.result.DashboardResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultShowDashboardUseCase implements ShowDashboardUseCase {
    private final InMemoryDashboardRepository dashboardRepository;
    private final DeviceServiceClient deviceServiceClient;

    public DefaultShowDashboardUseCase(InMemoryDashboardRepository dashboardRepository, DeviceServiceClient deviceServiceClient) {
        this.dashboardRepository = dashboardRepository;
        this.deviceServiceClient = deviceServiceClient;
    }

    @Override
    public DashboardResult execute() {
        return dashboardRepository.dashboard(deviceServiceClient.status());
    }
}
