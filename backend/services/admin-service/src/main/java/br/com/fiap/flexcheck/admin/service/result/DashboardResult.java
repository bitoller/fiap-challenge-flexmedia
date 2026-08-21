package br.com.fiap.flexcheck.admin.service.result;

import java.util.List;
import java.util.Map;

public record DashboardResult(
        Long hotelId,
        long reservationsToday,
        long activeStays,
        long completedCheckins,
        long completedCheckouts,
        long failedSessions,
        long openSupportRequests,
        DeviceStatusResult deviceStatus,
        List<Map<String, Object>> recentSessions
) {
}
