package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Guest;
import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.Room;
import br.com.fiap.flexcheck.checkin.security.SensitiveDataCodec;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.ResultSet;
import java.sql.SQLException;

@Component
public class ReservationRowMapper implements RowMapper<Reservation> {
    private final SensitiveDataCodec sensitiveDataCodec;

    public ReservationRowMapper(SensitiveDataCodec sensitiveDataCodec) {
        this.sensitiveDataCodec = sensitiveDataCodec;
    }

    @Override
    public Reservation mapRow(ResultSet rs, int rowNum) throws SQLException {
        Room room = null;
        Long roomId = rs.getObject("room_id", Long.class);
        if (roomId != null) {
            room = new Room(
                    roomId,
                    rs.getString("room_number"),
                    rs.getString("room_type"),
                    rs.getString("room_status")
            );
        }

        return new Reservation(
                rs.getLong("id"),
                rs.getObject("hotel_id", Long.class),
                rs.getObject("kiosk_id", Long.class),
                rs.getString("reservation_code"),
                rs.getString("status"),
                rs.getString("hotel_name"),
                rs.getObject("arrival_date", java.time.LocalDate.class),
                rs.getObject("departure_date", java.time.LocalDate.class),
                rs.getBigDecimal("total_amount"),
                rs.getString("currency"),
                new Guest(
                        rs.getLong("guest_id"),
                        rs.getString("full_name"),
                        rs.getString("document_type"),
                        sensitiveDataCodec.decrypt(rs.getString("document_number")),
                        rs.getObject("birth_date", java.time.LocalDate.class),
                        sensitiveDataCodec.decrypt(rs.getString("email")),
                        sensitiveDataCodec.decrypt(rs.getString("phone"))
                ),
                room
        );
    }
}
