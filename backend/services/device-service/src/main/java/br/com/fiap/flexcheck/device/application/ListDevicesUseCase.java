package br.com.fiap.flexcheck.device.application;

import br.com.fiap.flexcheck.device.service.result.KioskDeviceResult;

import java.util.List;

public interface ListDevicesUseCase {
    List<KioskDeviceResult> execute();
}
