package br.com.fiap.flexcheck.pms.infrastructure.repository;

import br.com.fiap.flexcheck.pms.application.command.PmsEventCommand;
import br.com.fiap.flexcheck.pms.service.result.PmsEventResult;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class JdbcPmsEventRepository implements PmsEventRepository {
    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert insert;
    private final ObjectMapper objectMapper;

    public JdbcPmsEventRepository(JdbcTemplate jdbc, DataSource dataSource, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
        this.insert = new SimpleJdbcInsert(dataSource)
                .withTableName("fc_pms_event")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public PmsEventResult recordEvent(PmsEventCommand command) {
        Map<String, Object> values = new HashMap<>();
        values.put("reservation_id", command.reservationId());
        values.put("event_type", command.eventType());
        values.put("status", defaultValue(command.status(), "PENDING"));
        values.put("payload", serialize(command.payload()));
        values.put("attempts", 0);
        values.put("last_attempt_at", null);
        values.put("created_at", Timestamp.valueOf(LocalDateTime.now()));
        Long id = insert.executeAndReturnKey(values).longValue();
        return findById(id);
    }

    @Override
    public PmsEventResult findById(Long eventId) {
        String sql = """
                SELECT id, reservation_id, event_type, status, payload, attempts, last_attempt_at, created_at
                  FROM fc_pms_event
                 WHERE id = ?
                """;
        return jdbc.queryForObject(sql, (rs, rowNum) -> new PmsEventResult(
                rs.getLong("id"),
                rs.getObject("reservation_id", Long.class),
                rs.getString("event_type"),
                rs.getString("status"),
                rs.getString("payload"),
                rs.getInt("attempts"),
                rs.getTimestamp("last_attempt_at") == null ? null : rs.getTimestamp("last_attempt_at").toLocalDateTime(),
                rs.getTimestamp("created_at").toLocalDateTime()
        ), eventId);
    }

    @Override
    public List<PmsEventResult> findPending() {
        String sql = """
                SELECT id, reservation_id, event_type, status, payload, attempts, last_attempt_at, created_at
                  FROM fc_pms_event
                 WHERE status IN ('PENDING', 'FAILED')
                 ORDER BY created_at DESC
                """;
        return jdbc.query(sql, (rs, rowNum) -> new PmsEventResult(
                rs.getLong("id"),
                rs.getObject("reservation_id", Long.class),
                rs.getString("event_type"),
                rs.getString("status"),
                rs.getString("payload"),
                rs.getInt("attempts"),
                rs.getTimestamp("last_attempt_at") == null ? null : rs.getTimestamp("last_attempt_at").toLocalDateTime(),
                rs.getTimestamp("created_at").toLocalDateTime()
        ));
    }

    @Override
    public PmsEventResult retry(Long eventId) {
        jdbc.update("""
                UPDATE fc_pms_event
                   SET status = 'SENT',
                       attempts = attempts + 1,
                       last_attempt_at = ?
                 WHERE id = ?
                """, Timestamp.valueOf(LocalDateTime.now()), eventId);
        return findById(eventId);
    }

    private String serialize(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("The PMS payload could not be serialized.", ex);
        }
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
