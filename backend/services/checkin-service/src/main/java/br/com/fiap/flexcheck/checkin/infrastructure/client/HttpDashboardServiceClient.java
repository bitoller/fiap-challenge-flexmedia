package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HttpDashboardServiceClient implements DashboardServiceClient {
    private final RestClient restClient;

    public HttpDashboardServiceClient(@Value("${services.admin.url:http://localhost:8085}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public DashboardResult loadDashboard() {
        return restClient.get()
                .uri("/api/v1/admin/dashboard")
                .retrieve()
                .body(DashboardResult.class);
    }
}
