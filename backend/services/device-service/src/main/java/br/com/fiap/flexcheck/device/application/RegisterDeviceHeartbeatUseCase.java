package br.com.fiap.flexcheck.device.application;

import br.com.fiap.flexcheck.device.application.command.DeviceHeartbeatCommand;
import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;

public interface RegisterDeviceHeartbeatUseCase {
    KioskDeviceResult execute(DeviceHeartbeatCommand command);
}
