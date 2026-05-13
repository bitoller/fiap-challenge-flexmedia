package br.com.fiap.flexcheck.device.service.result;

import java.util.List;

public record DeviceStatusResult(
        long totalDevices,
        long onlineDevices,
        long offlineDevices,
        long maintenanceDevices,
        long errorDevices,
        List<KioskDeviceResult> devices
) {
}
