package br.com.fiap.flexcheck.reservation.infrastructure.repository;

import br.com.fiap.flexcheck.reservation.application.command.CreateReservationCommand;
import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.application.exception.ReservationDeletionException;
import br.com.fiap.flexcheck.reservation.domain.entity.Reservation;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import br.com.fiap.flexcheck.reservation.security.SensitiveDataCodec;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcReservationRepository implements ReservationRepository {
    private final JdbcTemplate jdbc;
    private final ReservationRowMapper reservationRowMapper;
    private final SensitiveDataCodec sensitiveDataCodec;

    public JdbcReservationRepository(JdbcTemplate jdbc, ReservationRowMapper reservationRowMapper, SensitiveDataCodec sensitiveDataCodec) {
        this.jdbc = jdbc;
        this.reservationRowMapper = reservationRowMapper;
        this.sensitiveDataCodec = sensitiveDataCodec;
    }

    @Override
    public Optional<Reservation> searchReservation(Long kioskId, Long hotelId, String searchType, String value) {
        String normalizedType = searchType == null ? "" : searchType.toUpperCase();
        String searchValue = value == null ? "" : value.trim();
        String searchDigits = searchValue.replaceAll("\\D", "");
        String where = switch (normalizedType) {
            case "CPF", "DOCUMENT", "PASSPORT" -> "(r.guest_document_hash IN (?, ?) OR g.document_number IN (?, ?, ?))";
            case "EMAIL" -> "LOWER(g.email) = LOWER(?)";
            case "QR_TOKEN" -> "(UPPER(r.reservation_code) = UPPER(?) OR REGEXP_REPLACE(UPPER(r.reservation_code), '[^0-9]', '') = ?)";
            default -> "UPPER(r.reservation_code) = UPPER(?)";
        };

        String kioskClause = kioskId == null ? "" : " AND k.id = ?";
        String hotelClause = hotelId == null ? "" : " AND r.hotel_id = ?";
        String reservationStatusClause = switch (normalizedType) {
            case "CPF", "DOCUMENT", "PASSPORT" -> " AND UPPER(r.status) <> 'CHECKED_OUT'";
            default -> "";
        };

        String sql = """
                SELECT r.id,
                       r.hotel_id,
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
                       COALESCE(r.guest_document_encrypted, g.document_number) AS document_number,
                       g.birth_date,
                       COALESCE(r.guest_email_encrypted, g.email) AS email,
                       COALESCE(r.guest_phone_encrypted, g.phone) AS phone,
                       room.id AS room_id,
                       room.room_number,
                       room.room_type,
                       room.status AS room_status
                  FROM fc_reservation r
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  LEFT JOIN fc_room room ON room.id = r.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                  LEFT JOIN fc_kiosk_device k ON k.hotel_id = h.id
                 WHERE %s%s%s%s
                 ORDER BY CASE WHEN UPPER(r.status) = 'CONFIRMED' THEN 0 ELSE 1 END,
                          CASE WHEN UPPER(room.status) = 'AVAILABLE' THEN 0 ELSE 1 END,
                          CASE
                              WHEN TRUNC(r.arrival_date) BETWEEN TRUNC(CURRENT_DATE) - 1 AND TRUNC(CURRENT_DATE) + 1 THEN 0
                              ELSE 1
                          END,
                          ABS(TRUNC(r.arrival_date) - TRUNC(CURRENT_DATE)),
                          r.id DESC
                 FETCH FIRST 1 ROWS ONLY
                """.formatted(where, kioskClause, hotelClause, reservationStatusClause);

        List<Object> args = new ArrayList<>();
        if (normalizedType.equals("QR_TOKEN")) {
            args.add(searchValue);
            args.add(searchDigits);
        } else if (normalizedType.equals("CPF") || normalizedType.equals("DOCUMENT") || normalizedType.equals("PASSPORT")) {
            List<String> hashes = documentHashes(normalizedType, searchValue);
            args.add(hashes.get(0));
            args.add(hashes.get(1));
            args.add(searchValue);
            args.add(hashes.get(0));
            args.add(hashes.get(1));
        } else {
            args.add(value);
        }

        if (kioskId != null) {
            args.add(kioskId);
        }

        if (hotelId != null) {
            args.add(hotelId);
        }

        List<Reservation> results = jdbc.query(sql, reservationRowMapper, args.toArray());
        return results.stream().findFirst();
    }

    @Override
    public Optional<Reservation> findById(Long reservationId) {
        String sql = """
                SELECT r.id,
                       r.hotel_id,
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
                       COALESCE(r.guest_document_encrypted, g.document_number) AS document_number,
                       g.birth_date,
                       COALESCE(r.guest_email_encrypted, g.email) AS email,
                       COALESCE(r.guest_phone_encrypted, g.phone) AS phone,
                       room.id AS room_id,
                       room.room_number,
                       room.room_type,
                       room.status AS room_status
                  FROM fc_reservation r
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  LEFT JOIN fc_room room ON room.id = r.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                  LEFT JOIN fc_kiosk_device k ON k.hotel_id = h.id
                 WHERE r.id = ?
                """;
        List<Reservation> results = jdbc.query(sql, reservationRowMapper, reservationId);
        return results.stream().findFirst();
    }

    @Override
    public List<Reservation> listByHotelId(Long hotelId) {
        String sql = """
                SELECT r.id,
                       r.hotel_id,
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
                       COALESCE(r.guest_document_encrypted, g.document_number) AS document_number,
                       g.birth_date,
                       COALESCE(r.guest_email_encrypted, g.email) AS email,
                       COALESCE(r.guest_phone_encrypted, g.phone) AS phone,
                       room.id AS room_id,
                       room.room_number,
                       room.room_type,
                       room.status AS room_status
                  FROM fc_reservation r
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  LEFT JOIN fc_room room ON room.id = r.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                  LEFT JOIN fc_kiosk_device k ON k.hotel_id = h.id
                 WHERE r.hotel_id = ?
                 ORDER BY r.arrival_date DESC, r.id DESC
                """;
        return jdbc.query(sql, reservationRowMapper, hotelId);
    }

    @Override
    public void updateGuest(Long reservationId, GuestConfirmationCommand command) {
        jdbc.update("""
                UPDATE fc_guest
                   SET full_name = ?,
                       birth_date = ?,
                       updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?
                """,
                command.fullName(),
                command.birthDate(),
                command.guestId()
        );
        jdbc.update("""
                UPDATE fc_reservation
                   SET guest_document_hash = ?,
                       guest_document_encrypted = ?,
                       guest_email_encrypted = ?,
                       guest_phone_encrypted = ?,
                       updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?
                """,
                sensitiveDataCodec.documentHash(command.documentType(), command.documentNumber()),
                sensitiveDataCodec.encrypt(command.documentNumber()),
                sensitiveDataCodec.encrypt(command.email()),
                sensitiveDataCodec.encrypt(command.phone()),
                reservationId
        );
    }

    @Override
    public Reservation createReservation(CreateReservationCommand command) {
        ensureHotel(command.hotelId(), command.hotelName());
        Long roomId = ensureRoom(command.hotelId(), command.roomNumber(), command.roomType());
        Long guestId = ensureGuest(command);
        Long reservationId = insertReservation(command, roomId);
        jdbc.update("""
                INSERT INTO fc_reservation_guest (
                    reservation_id,
                    guest_id,
                    is_primary
                ) VALUES (?, ?, 'Y')
                """,
                reservationId,
                guestId
        );

        return findById(reservationId).orElseThrow(() -> new IllegalStateException("Reservation was created but not found."));
    }

    @Override
    public void deleteReservation(Long hotelId, Long reservationId) {
        List<Long> guestIds = jdbc.query("""
                SELECT guest_id
                  FROM fc_reservation_guest
                 WHERE reservation_id = ?
                """,
                (rs, rowNum) -> rs.getLong("guest_id"),
                reservationId
        );

        String stayStatus = jdbc.query("""
                SELECT status
                  FROM fc_stay
                 WHERE reservation_id = ?
                """,
                rs -> rs.next() ? rs.getString("status") : null,
                reservationId
        );

        Integer hotelMatches = jdbc.queryForObject("""
                SELECT COUNT(*)
                  FROM fc_reservation
                 WHERE id = ?
                   AND hotel_id = ?
                """, Integer.class, reservationId, hotelId);

        if (hotelMatches == null || hotelMatches == 0) {
            throw new ReservationDeletionException(
                    ReservationDeletionException.Reason.RESERVATION_NOT_FOUND,
                    "Reservation does not belong to the selected hotel."
            );
        }

        if (stayStatus != null && ("ACTIVE".equalsIgnoreCase(stayStatus) || "PENDING_KEY".equalsIgnoreCase(stayStatus))) {
            throw new ReservationDeletionException(
                    ReservationDeletionException.Reason.ACTIVE_STAY,
                    "Cannot delete a reservation with an active stay."
            );
        }

        deleteSessionChildren(reservationId);
        deleteStayChildren(reservationId);
        jdbc.update("DELETE FROM fc_reservation_addon WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_biometric_reference WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_reservation_guest WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_payment_transaction WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_pms_event WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_checkin_session WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_stay WHERE reservation_id = ?", reservationId);
        jdbc.update("DELETE FROM fc_reservation WHERE id = ?", reservationId);
        deleteOrphanGuests(guestIds);
    }

    private void deleteSessionChildren(Long reservationId) {
        List<Long> sessionIds = jdbc.query("""
                SELECT id
                  FROM fc_checkin_session
                 WHERE reservation_id = ?
                """,
                (rs, rowNum) -> rs.getLong("id"),
                reservationId
        );

        if (sessionIds.isEmpty()) {
            return;
        }

        for (Long sessionId : sessionIds) {
            jdbc.update("DELETE FROM fc_consent WHERE session_id = ?", sessionId);
            jdbc.update("DELETE FROM fc_document_verification WHERE session_id = ?", sessionId);
            jdbc.update("DELETE FROM fc_biometry_verification WHERE session_id = ?", sessionId);
            jdbc.update("DELETE FROM fc_biometric_reference WHERE session_id = ?", sessionId);
            jdbc.update("DELETE FROM fc_reservation_addon WHERE session_id = ?", sessionId);
        }
    }

    private void deleteStayChildren(Long reservationId) {
        List<Long> stayIds = jdbc.query("""
                SELECT id
                  FROM fc_stay
                 WHERE reservation_id = ?
                """,
                (rs, rowNum) -> rs.getLong("id"),
                reservationId
        );

        if (stayIds.isEmpty()) {
            return;
        }

        for (Long stayId : stayIds) {
            jdbc.update("DELETE FROM fc_key_credential WHERE stay_id = ?", stayId);
            jdbc.update("DELETE FROM fc_payment_transaction WHERE stay_id = ?", stayId);
        }
    }

    private void deleteOrphanGuests(List<Long> guestIds) {
        for (Long guestId : guestIds) {
            Integer links = jdbc.queryForObject("""
                    SELECT COUNT(*)
                      FROM fc_reservation_guest
                     WHERE guest_id = ?
                    """, Integer.class, guestId);
            if (links == null || links > 0) {
                continue;
            }
            jdbc.update("DELETE FROM fc_guest WHERE id = ?", guestId);
        }
    }

    private void ensureHotel(Long hotelId, String hotelName) {
        Integer hotelCount = jdbc.queryForObject("""
                SELECT COUNT(*)
                  FROM fc_hotel
                 WHERE id = ?
                """, Integer.class, hotelId);

        if (hotelCount != null && hotelCount > 0) {
            return;
        }

        jdbc.update("""
                INSERT INTO fc_hotel (
                    id,
                    name,
                    timezone,
                    checkin_time,
                    checkout_time,
                    early_checkin_minutes,
                    late_checkout_minutes,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                hotelId,
                hotelName,
                "America/Sao_Paulo",
                "14:00",
                "12:00",
                120,
                60,
                LocalDateTime.now()
        );
    }

    private Long ensureRoom(Long hotelId, String roomNumber, String roomType) {
        try {
            return jdbc.queryForObject("""
                    SELECT id
                      FROM fc_room
                     WHERE hotel_id = ?
                       AND room_number = ?
                    """, Long.class, hotelId, roomNumber);
        } catch (EmptyResultDataAccessException ignored) {
            jdbc.update("""
                    INSERT INTO fc_room (
                        hotel_id,
                        room_number,
                        room_type,
                        status,
                        floor_number
                    ) VALUES (?, ?, ?, 'AVAILABLE', ?)
                    """,
                    hotelId,
                    roomNumber,
                    roomType,
                    inferFloor(roomNumber)
            );
            return jdbc.queryForObject("""
                    SELECT id
                      FROM fc_room
                     WHERE hotel_id = ?
                       AND room_number = ?
                    """, Long.class, hotelId, roomNumber);
        }
    }

    private Long ensureGuest(CreateReservationCommand command) {
        List<String> hashes = documentHashes(command.guestDocumentType(), command.guestDocumentNumber());
        try {
            return jdbc.queryForObject("""
                    SELECT id
                     FROM fc_guest
                     WHERE document_type = ?
                       AND document_number IN (?, ?, ?)
                     FETCH FIRST 1 ROWS ONLY
                    """, Long.class, command.guestDocumentType(), hashes.get(0), hashes.get(1), command.guestDocumentNumber());
        } catch (EmptyResultDataAccessException ignored) {
            jdbc.update("""
                    INSERT INTO fc_guest (
                        full_name,
                        document_type,
                        document_number,
                        birth_date,
                        nationality,
                        email,
                        phone,
                        created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    command.guestFullName(),
                    command.guestDocumentType(),
                    sensitiveDataCodec.documentHash(command.guestDocumentType(), command.guestDocumentNumber()),
                    command.guestBirthDate(),
                    command.guestNationality(),
                    null,
                    null,
                    LocalDateTime.now()
            );
            return jdbc.queryForObject("""
                    SELECT id
                      FROM fc_guest
                     WHERE document_type = ?
                       AND document_number = ?
                    """, Long.class, command.guestDocumentType(), hashes.get(0));
        }
    }

    private Long insertReservation(CreateReservationCommand command, Long roomId) {
        String reservationCode = command.reservationCode();
        if (reservationCode == null || reservationCode.isBlank()) {
            reservationCode = String.format("TEST-%d-%d", command.hotelId(), System.currentTimeMillis());
        }

        jdbc.update("""
                INSERT INTO fc_reservation (
                    hotel_id,
                    room_id,
                    reservation_code,
                    pms_external_id,
                    status,
                    arrival_date,
                    departure_date,
                    adults,
                    children,
                    total_amount,
                    currency,
                    guest_document_hash,
                    guest_document_encrypted,
                    guest_email_encrypted,
                    guest_phone_encrypted,
                    created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                command.hotelId(),
                roomId,
                reservationCode,
                reservationCode,
                "CONFIRMED",
                command.arrivalDate(),
                command.departureDate(),
                command.adults(),
                command.children(),
                command.totalAmount(),
                command.currency(),
                sensitiveDataCodec.documentHash(command.guestDocumentType(), command.guestDocumentNumber()),
                sensitiveDataCodec.encrypt(command.guestDocumentNumber()),
                sensitiveDataCodec.encrypt(command.guestEmail()),
                sensitiveDataCodec.encrypt(command.guestPhone()),
                LocalDateTime.now()
        );

        return jdbc.queryForObject("""
                SELECT id
                  FROM fc_reservation
                 WHERE reservation_code = ?
                """, Long.class, reservationCode);
    }

    private int inferFloor(String roomNumber) {
        try {
            return Integer.parseInt(roomNumber.substring(0, 2));
        } catch (RuntimeException ex) {
            return 1;
        }
    }

    private List<String> documentHashes(String documentType, String documentNumber) {
        List<String> hashes = sensitiveDataCodec.documentHashCandidates(documentType, documentNumber);
        if (hashes.size() == 1) {
            return List.of(hashes.get(0), hashes.get(0));
        }
        return hashes;
    }
}
