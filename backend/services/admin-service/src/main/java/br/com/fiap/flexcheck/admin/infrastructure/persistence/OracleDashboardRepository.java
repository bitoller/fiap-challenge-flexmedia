package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.service.result.DashboardResult;
import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class OracleDashboardRepository {
    private final JdbcTemplate jdbc;
    private final OracleAuditRepository auditRepository;

    public OracleDashboardRepository(JdbcTemplate jdbc, OracleAuditRepository auditRepository) {
        this.jdbc = jdbc;
        this.auditRepository = auditRepository;
    }

    public DashboardResult dashboard(Long hotelId, DeviceStatusResult deviceStatus) {
        long reservationsToday = countHotelScoped("""
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE hotel_id = ?
                   AND TRUNC(created_at) = TRUNC(CURRENT_DATE)
                """,
                """
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE TRUNC(created_at) = TRUNC(CURRENT_DATE)
                """,
                hotelId
        );

        long activeStays = countHotelScoped("""
                SELECT COUNT(*)
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                 WHERE r.hotel_id = ?
                   AND UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                """,
                """
                SELECT COUNT(*)
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                 WHERE UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                """,
                hotelId
        );

        long completedCheckins = countHotelScoped("""
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE hotel_id = ?
                   AND UPPER(status) = 'CHECKED_IN'
                """,
                """
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE UPPER(status) = 'CHECKED_IN'
                """,
                hotelId
        );

        long completedCheckouts = countHotelScoped("""
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE hotel_id = ?
                   AND UPPER(status) = 'CHECKED_OUT'
                """,
                """
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE UPPER(status) = 'CHECKED_OUT'
                """,
                hotelId
        );

        long failedSessions = auditRepository.countByResult(hotelId, "FAILURE");
        List<Map<String, Object>> recent = auditRepository.recent(hotelId).stream()
                .map(event -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("hotelId", event.hotelId());
                    item.put("actorType", event.actorType());
                    item.put("actorId", event.actorId());
                    item.put("action", event.action());
                    item.put("resourceType", event.resourceType());
                    item.put("resourceId", event.resourceId());
                    item.put("result", event.result());
                    item.put("correlationId", event.correlationId());
                    return item;
                })
                .toList();

        return new DashboardResult(
                hotelId,
                reservationsToday,
                activeStays,
                completedCheckins,
                completedCheckouts,
                failedSessions,
                new DeviceStatusResult(
                        deviceStatus.totalDevices(),
                        deviceStatus.onlineDevices(),
                        deviceStatus.offlineDevices(),
                        deviceStatus.maintenanceDevices(),
                        deviceStatus.errorDevices(),
                        deviceStatus.devices()
                ),
                recent
        );
    }

    private long countHotelScoped(String hotelSql, String globalSql, Long hotelId) {
        Long count = hotelId == null
                ? jdbc.queryForObject(globalSql, Long.class)
                : jdbc.queryForObject(hotelSql, Long.class, hotelId);
        return count == null ? 0L : count;
    }
}
