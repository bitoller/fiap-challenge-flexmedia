package br.com.fiap.flexcheck.device.application.impl;

import br.com.fiap.flexcheck.device.application.GetDeviceStatusUseCase;
import br.com.fiap.flexcheck.device.infrastructure.repository.InMemoryDeviceRepository;
import br.com.fiap.flexcheck.device.service.result.DeviceStatusResult;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultGetDeviceStatusUseCase implements GetDeviceStatusUseCase {
    private final InMemoryDeviceRepository deviceRepository;

    public DefaultGetDeviceStatusUseCase(InMemoryDeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public DeviceStatusResult execute() {
        List<KioskDeviceResult> devices = deviceRepository.listDevices();
        long online = devices.stream().filter(device -> "ONLINE".equals(device.status())).count();
        long offline = devices.stream().filter(device -> "OFFLINE".equals(device.status())).count();
        long maintenance = devices.stream().filter(device -> "MAINTENANCE".equals(device.status())).count();
        long error = devices.stream().filter(device -> "ERROR".equals(device.status())).count();

        return new DeviceStatusResult(
                devices.size(),
                online,
                offline,
                maintenance,
                error,
                devices
        );
    }
}
