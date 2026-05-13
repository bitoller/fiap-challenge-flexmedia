package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;

public interface DashboardServiceClient {
    DashboardResult loadDashboard();
}
