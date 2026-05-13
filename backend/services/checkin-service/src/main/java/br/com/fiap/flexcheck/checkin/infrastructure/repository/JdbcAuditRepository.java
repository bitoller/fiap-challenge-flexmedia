package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class JdbcAuditRepository implements AuditRepository {
    private final JdbcTemplate jdbc;

    public JdbcAuditRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void record(AuditEvent event) {
        jdbc.update("""
                INSERT INTO fc_audit_log (actor_type, actor_id, action, resource_type, resource_id, result, correlation_id, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, event.actorType(), event.actorId(), event.action(), event.resourceType(), event.resourceId(),
                event.result(), event.correlationId(), Timestamp.valueOf(LocalDateTime.now()));
    }
}
