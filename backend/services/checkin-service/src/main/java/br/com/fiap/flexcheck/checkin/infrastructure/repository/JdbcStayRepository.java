package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Stay;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public class JdbcStayRepository implements StayRepository {
    private final JdbcTemplate jdbc;
    private final SimpleJdbcInsert stayInsert;

    public JdbcStayRepository(JdbcTemplate jdbc, DataSource dataSource) {
        this.jdbc = jdbc;
        this.stayInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("fc_stay")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public Long createStay(Long reservationId, Long roomId, LocalDate departureDate, BigDecimal totalAmount) {
        Map<String, Object> values = new HashMap<>();
        values.put("reservation_id", reservationId);
        values.put("room_id", roomId);
        values.put("status", "ACTIVE");
        values.put("checked_in_at", Timestamp.valueOf(LocalDateTime.now()));
        values.put("expected_checkout_at", Timestamp.valueOf(LocalDateTime.of(departureDate, LocalTime.NOON)));
        values.put("created_at", Timestamp.valueOf(LocalDateTime.now()));
        return stayInsert.executeAndReturnKey(values).longValue();
    }

    @Override
    public Optional<Stay> findStay(Long stayId) {
        String sql = """
                SELECT st.id, st.reservation_id, r.hotel_id, st.room_id, st.status, r.total_amount
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                 WHERE st.id = ?
                """;
        List<Stay> stays = jdbc.query(sql, (rs, rowNum) -> new Stay(
                rs.getLong("id"),
                rs.getLong("reservation_id"),
                rs.getLong("hotel_id"),
                rs.getLong("room_id"),
                rs.getString("status"),
                rs.getBigDecimal("total_amount")
        ), stayId);
        return stays.stream().findFirst();
    }

    @Override
    public void markCheckedIn(Long sessionId, Long reservationId, Long roomId) {
        jdbc.update("UPDATE fc_reservation SET status = 'CHECKED_IN', updated_at = ? WHERE id = ?",
                Timestamp.valueOf(LocalDateTime.now()), reservationId);
        jdbc.update("UPDATE fc_room SET status = 'OCCUPIED' WHERE id = ?", roomId);
        jdbc.update("UPDATE fc_checkin_session SET status = 'CHECKED_IN', completed_at = ? WHERE id = ?",
                Timestamp.valueOf(LocalDateTime.now()), sessionId);
    }

    @Override
    public void checkout(Stay stay) {
        Timestamp now = Timestamp.valueOf(LocalDateTime.now());
        jdbc.update("UPDATE fc_stay SET status = 'CHECKED_OUT', checked_out_at = ? WHERE id = ?", now, stay.id());
        jdbc.update("UPDATE fc_reservation SET status = 'CHECKED_OUT', updated_at = ? WHERE id = ?", now, stay.reservationId());
        jdbc.update("UPDATE fc_room SET status = 'CLEANING' WHERE id = ?", stay.roomId());
    }
}
