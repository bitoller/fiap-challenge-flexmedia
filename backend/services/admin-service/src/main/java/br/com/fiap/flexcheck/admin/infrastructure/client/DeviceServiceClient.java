package br.com.fiap.flexcheck.admin.infrastructure.client;

import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;

public interface DeviceServiceClient {
    DeviceStatusResult status();
}
