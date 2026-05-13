package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.CheckinSession;
import br.com.fiap.flexcheck.checkin.domain.entity.SessionContext;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public class JdbcSessionRepository implements SessionRepository {
    private final JdbcTemplate jdbc;
    private final ReservationRowMapper reservationRowMapper;
    private final SimpleJdbcInsert sessionInsert;

    public JdbcSessionRepository(JdbcTemplate jdbc, DataSource dataSource, ReservationRowMapper reservationRowMapper) {
        this.jdbc = jdbc;
        this.reservationRowMapper = reservationRowMapper;
        this.sessionInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("fc_checkin_session")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public CheckinSession createSession(Long kioskId, String flowType, String language) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(15);
        String correlationId = UUID.randomUUID().toString();

        Map<String, Object> values = new HashMap<>();
        values.put("kiosk_id", kioskId);
        values.put("flow_type", flowType.toUpperCase());
        values.put("status", "STARTED");
        values.put("language", language == null || language.isBlank() ? "pt-BR" : language);
        values.put("started_at", Timestamp.valueOf(now));
        values.put("expires_at", Timestamp.valueOf(expiresAt));
        values.put("correlation_id", correlationId);

        Number id = sessionInsert.executeAndReturnKey(values);
        return new CheckinSession(id.longValue(), "STARTED", expiresAt, correlationId);
    }

    @Override
    public void attachReservation(Long sessionId, Long reservationId) {
        int updated = jdbc.update("""
                UPDATE fc_checkin_session
                   SET reservation_id = ?, status = 'RESERVATION_FOUND'
                 WHERE id = ?
                """, reservationId, sessionId);
        if (updated == 0) {
            throw new BusinessException("SESSION_NOT_FOUND", "Sessao nao encontrada.", 404);
        }
    }

    @Override
    public void failSession(Long sessionId, String reason) {
        jdbc.update("""
                UPDATE fc_checkin_session
                   SET status = 'HANDOFF', failure_reason = ?
                 WHERE id = ?
                """, reason, sessionId);
    }

    @Override
    public void updateSessionStatus(Long sessionId, String status) {
        int updated = jdbc.update("UPDATE fc_checkin_session SET status = ? WHERE id = ?", status, sessionId);
        if (updated == 0) {
            throw new BusinessException("SESSION_NOT_FOUND", "Sessao nao encontrada.", 404);
        }
    }

    @Override
    public Long findGuestIdBySession(Long sessionId) {
        return jdbc.queryForObject("""
                SELECT g.id
                  FROM fc_checkin_session s
                  JOIN fc_reservation_guest rg ON rg.reservation_id = s.reservation_id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE s.id = ?
                """, Long.class, sessionId);
    }

    @Override
    public Long findReservationIdBySession(Long sessionId) {
        return jdbc.queryForObject("""
                SELECT reservation_id
                  FROM fc_checkin_session
                 WHERE id = ?
                """, Long.class, sessionId);
    }

    @Override
    public Optional<SessionContext> findSessionContext(Long sessionId) {
        String sql = """
                SELECT s.id AS session_id,
                       s.status AS session_status,
                       s.correlation_id,
                       r.id,
                       k.id AS kiosk_id,
                       r.reservation_code,
                       r.status,
                       h.name AS hotel_name,
                       r.arrival_date,
                       r.departure_date,
                       r.total_amount,
                       r.currency,
                       g.id AS guest_id,
                       g.full_name,
                       g.document_type,
                       g.document_number,
                       g.birth_date,
                       g.email,
                       g.phone,
                       room.id AS room_id,
                       room.room_number,
                       room.room_type,
                       room.status AS room_status
                  FROM fc_checkin_session s
                  JOIN fc_reservation r ON r.id = s.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  LEFT JOIN fc_room room ON room.id = r.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                  LEFT JOIN fc_kiosk_device k ON k.id = s.kiosk_id
                 WHERE s.id = ?
                """;

        List<SessionContext> contexts = jdbc.query(sql, (rs, rowNum) -> new SessionContext(
                rs.getLong("session_id"),
                rs.getString("session_status"),
                rs.getString("correlation_id"),
                reservationRowMapper.mapRow(rs, rowNum)
        ), sessionId);
        return contexts.stream().findFirst();
    }
}
