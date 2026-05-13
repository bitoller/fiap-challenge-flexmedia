package br.com.fiap.flexcheck.admin.domain.entity;

import java.util.List;
import java.util.Map;

public record Dashboard(
        long reservationsToday,
        long activeStays,
        long completedCheckins,
        long completedCheckouts,
        long failedSessions,
        DeviceStatus deviceStatus,
        List<Map<String, Object>> recentSessions
) {
    public record DeviceStatus(
            long totalDevices,
            long onlineDevices,
            long offlineDevices,
            long maintenanceDevices,
            long errorDevices,
            List<Map<String, Object>> devices
    ) {
    }
}
