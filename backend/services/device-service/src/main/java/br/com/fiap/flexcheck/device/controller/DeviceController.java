package br.com.fiap.flexcheck.device.controller;

import br.com.fiap.flexcheck.device.application.GetDeviceStatusUseCase;
import br.com.fiap.flexcheck.device.application.ListDevicesUseCase;
import br.com.fiap.flexcheck.device.application.RegisterDeviceHeartbeatUseCase;
import br.com.fiap.flexcheck.device.application.command.DeviceHeartbeatCommand;
import br.com.fiap.flexcheck.device.service.result.DeviceStatusResult;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/devices")
public class DeviceController {
    private final RegisterDeviceHeartbeatUseCase registerDeviceHeartbeatUseCase;
    private final ListDevicesUseCase listDevicesUseCase;
    private final GetDeviceStatusUseCase getDeviceStatusUseCase;

    public DeviceController(
            RegisterDeviceHeartbeatUseCase registerDeviceHeartbeatUseCase,
            ListDevicesUseCase listDevicesUseCase,
            GetDeviceStatusUseCase getDeviceStatusUseCase
    ) {
        this.registerDeviceHeartbeatUseCase = registerDeviceHeartbeatUseCase;
        this.listDevicesUseCase = listDevicesUseCase;
        this.getDeviceStatusUseCase = getDeviceStatusUseCase;
    }

    @PostMapping("/heartbeats")
    public KioskDeviceResult heartbeat(@Valid @RequestBody DeviceHeartbeatCommand command) {
        return registerDeviceHeartbeatUseCase.execute(command);
    }

    @GetMapping
    public List<KioskDeviceResult> list() {
        return listDevicesUseCase.execute();
    }

    @GetMapping("/{deviceCode}")
    public KioskDeviceResult findByCode(@PathVariable String deviceCode) {
        return listDevicesUseCase.execute().stream()
                .filter(device -> device.deviceCode().equalsIgnoreCase(deviceCode))
                .findFirst()
                .orElseThrow(() -> new DeviceNotFoundException(deviceCode));
    }

    @GetMapping("/status")
    public DeviceStatusResult status() {
        return getDeviceStatusUseCase.execute();
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    private static final class DeviceNotFoundException extends RuntimeException {
        private DeviceNotFoundException(String deviceCode) {
            super("Device not found: " + deviceCode);
        }
    }
}
