package br.com.fiap.flexcheck.checkin.domain.entity;

import java.util.List;
import java.util.Map;

public record Dashboard(
        long reservationsToday,
        long activeStays,
        long completedCheckins,
        long completedCheckouts,
        long failedSessions,
        List<Map<String, Object>> recentSessions
) {
}

