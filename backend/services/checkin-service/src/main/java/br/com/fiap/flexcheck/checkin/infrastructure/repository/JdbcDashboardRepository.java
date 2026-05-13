package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Dashboard;
import br.com.fiap.flexcheck.checkin.repository.DashboardRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class JdbcDashboardRepository implements DashboardRepository {
    private final JdbcTemplate jdbc;

    public JdbcDashboardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public Dashboard dashboard() {
        long reservationsToday = count("SELECT COUNT(*) FROM fc_reservation WHERE arrival_date = TRUNC(CURRENT_DATE)");
        long activeStays = count("SELECT COUNT(*) FROM fc_stay WHERE status IN ('ACTIVE', 'PENDING_KEY')");
        long completedCheckins = count("SELECT COUNT(*) FROM fc_checkin_session WHERE status = 'CHECKED_IN'");
        long completedCheckouts = count("SELECT COUNT(*) FROM fc_stay WHERE status = 'CHECKED_OUT'");
        long failedSessions = count("SELECT COUNT(*) FROM fc_checkin_session WHERE status IN ('FAILED', 'HANDOFF', 'EXPIRED')");

        List<Map<String, Object>> recent = jdbc.queryForList("""
                SELECT id, flow_type, status, started_at, failure_reason
                  FROM fc_checkin_session
                 ORDER BY started_at DESC
                 FETCH FIRST 8 ROWS ONLY
                """);

        return new Dashboard(reservationsToday, activeStays, completedCheckins, completedCheckouts, failedSessions, recent);
    }

    private long count(String sql) {
        Long value = jdbc.queryForObject(sql, Long.class);
        return value == null ? 0 : value;
    }
}
