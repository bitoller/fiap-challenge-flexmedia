package br.com.fiap.flexcheck.admin.infrastructure.client;

import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class HttpDeviceServiceClient implements DeviceServiceClient {
    private final RestClient restClient;

    public HttpDeviceServiceClient(@Value("${DEVICE_SERVICE_URL:http://localhost:8089}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Override
    public DeviceStatusResult status() {
        return restClient.get()
                .uri("/api/v1/devices/status")
                .retrieve()
                .body(DeviceStatusResult.class);
    }
}
