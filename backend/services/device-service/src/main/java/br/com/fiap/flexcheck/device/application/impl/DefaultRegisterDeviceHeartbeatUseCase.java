package br.com.fiap.flexcheck.device.application.impl;

import br.com.fiap.flexcheck.device.application.RegisterDeviceHeartbeatUseCase;
import br.com.fiap.flexcheck.device.application.command.DeviceHeartbeatCommand;
import br.com.fiap.flexcheck.device.infrastructure.repository.InMemoryDeviceRepository;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRegisterDeviceHeartbeatUseCase implements RegisterDeviceHeartbeatUseCase {
    private final InMemoryDeviceRepository deviceRepository;

    public DefaultRegisterDeviceHeartbeatUseCase(InMemoryDeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public KioskDeviceResult execute(DeviceHeartbeatCommand command) {
        return deviceRepository.recordHeartbeat(command);
    }
}
