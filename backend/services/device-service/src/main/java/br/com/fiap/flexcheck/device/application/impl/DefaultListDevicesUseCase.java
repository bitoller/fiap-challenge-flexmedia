package br.com.fiap.flexcheck.device.application.impl;

import br.com.fiap.flexcheck.device.application.ListDevicesUseCase;
import br.com.fiap.flexcheck.device.infrastructure.repository.InMemoryDeviceRepository;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListDevicesUseCase implements ListDevicesUseCase {
    private final InMemoryDeviceRepository deviceRepository;

    public DefaultListDevicesUseCase(InMemoryDeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    @Override
    public List<KioskDeviceResult> execute(Long hotelId) {
        return deviceRepository.listDevices(hotelId);
    }
}
