package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.repository.ReservationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class JdbcReservationRepository implements ReservationRepository {
    private final JdbcTemplate jdbc;
    private final ReservationRowMapper reservationRowMapper;

    public JdbcReservationRepository(JdbcTemplate jdbc, ReservationRowMapper reservationRowMapper) {
        this.jdbc = jdbc;
        this.reservationRowMapper = reservationRowMapper;
    }

    @Override
    public Optional<Reservation> findReservation(String searchType, String value) {
        String normalizedType = searchType == null ? "" : searchType.toUpperCase();
        String where = switch (normalizedType) {
            case "CPF", "DOCUMENT", "PASSPORT" -> "g.document_number = ?";
            case "EMAIL" -> "LOWER(g.email) = LOWER(?)";
            default -> "UPPER(r.reservation_code) = UPPER(?)";
        };

        String sql = """
                SELECT r.id,
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
                  FROM fc_reservation r
                  JOIN fc_hotel h ON h.id = r.hotel_id
                  LEFT JOIN fc_room room ON room.id = r.room_id
                  JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                  JOIN fc_guest g ON g.id = rg.guest_id
                  LEFT JOIN fc_kiosk_device k ON k.hotel_id = h.id
                 WHERE %s
                 FETCH FIRST 1 ROWS ONLY
                """.formatted(where);

        List<Reservation> results = jdbc.query(sql, reservationRowMapper, value);
        return results.stream().findFirst();
    }
}
