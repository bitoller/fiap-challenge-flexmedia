package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OracleAuditRepository {
    private final JdbcTemplate jdbc;

    public OracleAuditRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void record(AuditEvent event) {
        jdbc.update("""
                INSERT INTO fc_audit_log (
                    hotel_id,
                    actor_type,
                    actor_id,
                    action,
                    resource_type,
                    resource_id,
                    result,
                    correlation_id,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
                """,
                event.hotelId(),
                event.actorType(),
                event.actorId(),
                event.action(),
                event.resourceType(),
                event.resourceId(),
                event.result(),
                event.correlationId()
        );
    }

    public List<AuditEvent> recent(Long hotelId) {
        String sql = hotelId == null
                ? """
                SELECT hotel_id, actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, created_at
                  FROM (
                        SELECT hotel_id, actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, created_at
                          FROM fc_audit_log
                         ORDER BY created_at DESC, id DESC
                       )
                 WHERE ROWNUM <= 8
                """
                : """
                SELECT hotel_id, actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, created_at
                  FROM (
                        SELECT hotel_id, actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, created_at
                          FROM fc_audit_log
                         WHERE hotel_id = ?
                         ORDER BY created_at DESC, id DESC
                       )
                 WHERE ROWNUM <= 8
                """;
        return hotelId == null
                ? jdbc.query(sql, this::mapRow)
                : jdbc.query(sql, this::mapRow, hotelId);
    }

    public long countByAction(Long hotelId, String action) {
        return countByColumn("action", hotelId, action);
    }

    public long countByResult(Long hotelId, String result) {
        return countByColumn("result", hotelId, result);
    }

    public long countOpenSupportRequests(Long hotelId) {
        String sql = hotelId == null
                ? """
                SELECT COUNT(*)
                  FROM fc_audit_log
                 WHERE UPPER(action) IN ('CONCIERGE_HELP_REQUESTED', 'GUEST_SERVICE_REQUESTED')
                   AND UPPER(result) = 'SUCCESS'
                """
                : """
                SELECT COUNT(*)
                  FROM fc_audit_log
                 WHERE hotel_id = ?
                   AND UPPER(action) IN ('CONCIERGE_HELP_REQUESTED', 'GUEST_SERVICE_REQUESTED')
                   AND UPPER(result) = 'SUCCESS'
                """;
        Long count = hotelId == null
                ? jdbc.queryForObject(sql, Long.class)
                : jdbc.queryForObject(sql, Long.class, hotelId);
        return count == null ? 0L : count;
    }

    public int acknowledgeOpenSupportRequests(long hotelId) {
        return jdbc.update("""
                UPDATE fc_audit_log
                   SET action = CASE
                       WHEN UPPER(action) = 'CONCIERGE_HELP_REQUESTED' THEN 'CONCIERGE_HELP_ACKNOWLEDGED'
                       ELSE 'GUEST_SERVICE_ACKNOWLEDGED'
                   END
                 WHERE hotel_id = ?
                   AND UPPER(action) IN ('CONCIERGE_HELP_REQUESTED', 'GUEST_SERVICE_REQUESTED')
                   AND UPPER(result) = 'SUCCESS'
                """, hotelId);
    }

    private long countByColumn(String column, Long hotelId, String value) {
        String sql = hotelId == null
                ? "SELECT COUNT(*) FROM fc_audit_log WHERE UPPER(" + column + ") = UPPER(?)"
                : "SELECT COUNT(*) FROM fc_audit_log WHERE hotel_id = ? AND UPPER(" + column + ") = UPPER(?)";
        Long count = hotelId == null
                ? jdbc.queryForObject(sql, Long.class, value)
                : jdbc.queryForObject(sql, Long.class, hotelId, value);
        return count == null ? 0L : count;
    }

    private AuditEvent mapRow(java.sql.ResultSet rs, int rowNum) throws java.sql.SQLException {
        long hotelId = rs.getLong("hotel_id");
        return new AuditEvent(
                rs.wasNull() ? null : hotelId,
                rs.getString("actor_type"),
                rs.getString("actor_id"),
                rs.getString("action"),
                rs.getString("resource_type"),
                rs.getString("resource_id"),
                rs.getString("result"),
                rs.getString("correlation_id"),
                rs.getTimestamp("created_at") == null ? null : rs.getTimestamp("created_at").toInstant().toString()
        );
    }
}
