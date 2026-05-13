package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Guest;
import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.Room;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Component;

import java.sql.SQLException;

@Component
class ReservationRowMapper implements RowMapper<Reservation> {

    @Override
    public Reservation mapRow(java.sql.ResultSet rs, int rowNum) throws SQLException {
        Room room = rs.getObject("room_id") == null ? null : new Room(
                rs.getLong("room_id"),
                rs.getString("room_number"),
                rs.getString("room_type"),
                rs.getString("room_status")
        );

        Guest guest = new Guest(
                rs.getLong("guest_id"),
                rs.getString("full_name"),
                rs.getString("document_type"),
                rs.getString("document_number"),
                rs.getDate("birth_date") == null ? null : rs.getDate("birth_date").toLocalDate(),
                rs.getString("email"),
                rs.getString("phone")
        );

        return new Reservation(
                rs.getLong("id"),
                rs.getLong("kiosk_id"),
                rs.getString("reservation_code"),
                rs.getString("status"),
                rs.getString("hotel_name"),
                rs.getDate("arrival_date").toLocalDate(),
                rs.getDate("departure_date").toLocalDate(),
                rs.getBigDecimal("total_amount"),
                rs.getString("currency"),
                guest,
                room
        );
    }
}
