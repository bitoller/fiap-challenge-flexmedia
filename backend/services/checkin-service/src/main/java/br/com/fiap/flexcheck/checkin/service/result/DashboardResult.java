package br.com.fiap.flexcheck.checkin.service.result;

import java.util.List;
import java.util.Map;

public record DashboardResult(
        long reservationsToday,
        long activeStays,
        long completedCheckins,
        long completedCheckouts,
        long failedSessions,
        List<Map<String, Object>> recentSessions
) {
}

