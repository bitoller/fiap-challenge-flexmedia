package br.com.fiap.flexcheck.checkin.dto;

import java.util.List;
import java.util.Map;

public record DashboardResponse(
        long reservationsToday,
        long activeStays,
        long completedCheckins,
        long completedCheckouts,
        long failedSessions,
        List<Map<String, Object>> recentSessions
) {
}
