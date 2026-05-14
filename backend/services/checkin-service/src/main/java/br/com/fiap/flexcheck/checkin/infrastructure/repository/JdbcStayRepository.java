package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Stay;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutStayStateResult;
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
    private final CheckoutPreviewRowMapper checkoutPreviewRowMapper;

    public JdbcStayRepository(JdbcTemplate jdbc, DataSource dataSource, CheckoutPreviewRowMapper checkoutPreviewRowMapper) {
        this.jdbc = jdbc;
        this.checkoutPreviewRowMapper = checkoutPreviewRowMapper;
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
    public Optional<CheckoutPreviewResult> findCheckoutPreview(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        Optional<CheckoutPreviewResult> preview = lookupCheckoutPreview(hotelId, roomNumber, documentType, documentNumber);
        if (preview.isPresent()) {
            return preview;
        }

        reconcileMissingStay(hotelId, roomNumber, documentType, documentNumber);
        return lookupCheckoutPreview(hotelId, roomNumber, documentType, documentNumber);
    }

    @Override
    public Optional<CheckoutStayStateResult> findCheckoutState(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        return lookupCheckoutState(hotelId, roomNumber, documentType, documentNumber);
    }

    private Optional<CheckoutPreviewResult> lookupCheckoutPreview(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        if (hasText(roomNumber) && hasText(documentNumber)) {
            Optional<CheckoutPreviewResult> preview = queryCheckoutPreview(hotelId, roomNumber, documentType, documentNumber);
            if (preview.isPresent()) {
                return preview;
            }
        }

        if (hasText(roomNumber)) {
            Optional<CheckoutPreviewResult> preview = queryCheckoutPreviewByRoom(hotelId, roomNumber);
            if (preview.isPresent()) {
                return preview;
            }
        }

        if (hasText(documentNumber)) {
            return queryCheckoutPreviewByDocument(hotelId, documentType, documentNumber);
        }

        return Optional.empty();
    }

    private Optional<CheckoutStayStateResult> lookupCheckoutState(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        if (hasText(roomNumber) && hasText(documentNumber)) {
            Optional<CheckoutStayStateResult> state = queryCheckoutState(hotelId, roomNumber, documentType, documentNumber);
            if (state.isPresent()) {
                return state;
            }
        }

        if (hasText(roomNumber)) {
            Optional<CheckoutStayStateResult> state = queryCheckoutStateByRoom(hotelId, roomNumber);
            if (state.isPresent()) {
                return state;
            }
        }

        if (hasText(documentNumber)) {
            return queryCheckoutStateByDocument(hotelId, documentType, documentNumber);
        }

        return Optional.empty();
    }

    private Optional<CheckoutPreviewResult> queryCheckoutPreview(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status,
                       r.id AS reservation_id,
                       r.hotel_id,
                       r.reservation_code,
                       r.status AS reservation_status,
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
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE h.id = ?
                   AND room.room_number = ?
                   AND UPPER(g.document_type) = UPPER(?)
                   AND g.document_number = ?
                   AND UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                   AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, checkoutPreviewRowMapper, hotelId, roomNumber, documentType, documentNumber)
                .stream()
                .findFirst();
    }

    private Optional<CheckoutPreviewResult> queryCheckoutPreviewByRoom(Long hotelId, String roomNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status,
                       r.id AS reservation_id,
                       r.hotel_id,
                       r.reservation_code,
                       r.status AS reservation_status,
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
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE h.id = ?
                   AND room.room_number = ?
                   AND UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                   AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, checkoutPreviewRowMapper, hotelId, roomNumber)
                .stream()
                .findFirst();
    }

    private Optional<CheckoutPreviewResult> queryCheckoutPreviewByDocument(Long hotelId, String documentType, String documentNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status,
                       r.id AS reservation_id,
                       r.hotel_id,
                       r.reservation_code,
                       r.status AS reservation_status,
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
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE h.id = ?
                   AND UPPER(g.document_type) = UPPER(?)
                   AND g.document_number = ?
                   AND UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                   AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, checkoutPreviewRowMapper, hotelId, documentType, documentNumber)
                .stream()
                .findFirst();
    }

    private Optional<CheckoutStayStateResult> queryCheckoutState(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE h.id = ?
                   AND room.room_number = ?
                   AND UPPER(g.document_type) = UPPER(?)
                   AND g.document_number = ?
                 ORDER BY st.checked_in_at DESC
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, (rs, rowNum) -> new CheckoutStayStateResult(
                rs.getLong("stay_id"),
                rs.getString("stay_status")
        ), hotelId, roomNumber, documentType, documentNumber)
                .stream()
                .findFirst();
    }

    private Optional<CheckoutStayStateResult> queryCheckoutStateByRoom(Long hotelId, String roomNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                 WHERE h.id = ?
                   AND room.room_number = ?
                 ORDER BY st.checked_in_at DESC
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, (rs, rowNum) -> new CheckoutStayStateResult(
                rs.getLong("stay_id"),
                rs.getString("stay_status")
        ), hotelId, roomNumber)
                .stream()
                .findFirst();
    }

    private Optional<CheckoutStayStateResult> queryCheckoutStateByDocument(Long hotelId, String documentType, String documentNumber) {
        String sql = """
                SELECT st.id AS stay_id,
                       st.status AS stay_status
                  FROM fc_stay st
                  JOIN fc_reservation r ON r.id = st.reservation_id
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  JOIN fc_room room ON room.id = st.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                 WHERE h.id = ?
                   AND UPPER(g.document_type) = UPPER(?)
                   AND g.document_number = ?
                 ORDER BY st.checked_in_at DESC
                 FETCH FIRST 1 ROWS ONLY
                """;

        return jdbc.query(sql, (rs, rowNum) -> new CheckoutStayStateResult(
                rs.getLong("stay_id"),
                rs.getString("stay_status")
        ), hotelId, documentType, documentNumber)
                .stream()
                .findFirst();
    }

    private void reconcileMissingStay(Long hotelId, String roomNumber, String documentType, String documentNumber) {
        Optional<ReconciliationCandidate> candidate = jdbc.query("""
                        SELECT r.id AS reservation_id,
                               r.room_id,
                               r.departure_date,
                               r.total_amount
                          FROM fc_reservation r
                          JOIN fc_hotel h ON h.id = r.hotel_id
                          JOIN fc_room room ON room.id = r.room_id
                          JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                          JOIN fc_guest g ON g.id = rg.guest_id
                         WHERE h.id = ?
                           AND room.room_number = ?
                           AND UPPER(g.document_type) = UPPER(?)
                           AND g.document_number = ?
                           AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                        FETCH FIRST 1 ROWS ONLY
                        """,
                (rs, rowNum) -> new ReconciliationCandidate(
                        rs.getLong("reservation_id"),
                        rs.getLong("room_id"),
                        rs.getDate("departure_date").toLocalDate(),
                        rs.getBigDecimal("total_amount")
                ),
                hotelId,
                roomNumber,
                documentType,
                documentNumber
        ).stream().findFirst();

        if (candidate.isEmpty()) {
            candidate = jdbc.query("""
                            SELECT r.id AS reservation_id,
                                   r.room_id,
                                   r.departure_date,
                                   r.total_amount
                              FROM fc_reservation r
                              JOIN fc_hotel h ON h.id = r.hotel_id
                              JOIN fc_room room ON room.id = r.room_id
                             WHERE h.id = ?
                               AND room.room_number = ?
                               AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                             FETCH FIRST 1 ROWS ONLY
                            """,
                    (rs, rowNum) -> new ReconciliationCandidate(
                            rs.getLong("reservation_id"),
                            rs.getLong("room_id"),
                            rs.getDate("departure_date").toLocalDate(),
                            rs.getBigDecimal("total_amount")
                    ),
                    hotelId,
                    roomNumber
            ).stream().findFirst();
        }

        if (candidate.isEmpty() || hasActiveStay(candidate.get().reservationId())) {
            return;
        }

        ReconciliationCandidate data = candidate.get();
        try {
            createStay(data.reservationId(), data.roomId(), data.departureDate(), data.totalAmount());
            jdbc.update("UPDATE fc_reservation SET status = 'CHECKED_IN', updated_at = ? WHERE id = ?",
                    Timestamp.valueOf(LocalDateTime.now()), data.reservationId());
            jdbc.update("UPDATE fc_room SET status = 'OCCUPIED' WHERE id = ?", data.roomId());
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to reconcile missing stay.", ex);
        }
    }

    private boolean hasActiveStay(Long reservationId) {
        Integer count = jdbc.queryForObject("""
                SELECT COUNT(*)
                  FROM fc_stay
                 WHERE reservation_id = ?
                   AND UPPER(status) IN ('ACTIVE', 'PENDING_KEY')
                """, Integer.class, reservationId);
        return count != null && count > 0;
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
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

    private record ReconciliationCandidate(
            Long reservationId,
            Long roomId,
            LocalDate departureDate,
            BigDecimal totalAmount
    ) {
    }
}
