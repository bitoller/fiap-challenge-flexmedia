package br.com.fiap.flexcheck.admin.service.result;

import java.util.List;
import java.util.Map;

public record DeviceStatusResult(
        long totalDevices,
        long onlineDevices,
        long offlineDevices,
        long maintenanceDevices,
        long errorDevices,
        List<Map<String, Object>> devices
) {
}
