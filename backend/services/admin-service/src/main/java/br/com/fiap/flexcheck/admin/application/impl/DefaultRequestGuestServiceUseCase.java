package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.RecordAuditUseCase;
import br.com.fiap.flexcheck.admin.application.RequestGuestServiceUseCase;
import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class DefaultRequestGuestServiceUseCase implements RequestGuestServiceUseCase {
    private final RecordAuditUseCase recordAuditUseCase;
    private final JdbcTemplate jdbc;

    public DefaultRequestGuestServiceUseCase(RecordAuditUseCase recordAuditUseCase, JdbcTemplate jdbc) {
        this.recordAuditUseCase = recordAuditUseCase;
        this.jdbc = jdbc;
    }

    @Override
    public void execute(GuestServiceRequestCommand command) {
        String correlationId = command.correlationId() == null || command.correlationId().isBlank()
                ? UUID.randomUUID().toString()
                : command.correlationId();

        String roomNumber = command.roomNumber() == null ? "" : command.roomNumber().trim();
        if (roomNumber.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Room number is required for guest service requests");
        }

        Integer checkedInRoomCount = jdbc.queryForObject("""
                SELECT COUNT(*)
                  FROM fc_reservation r
                  JOIN fc_room room ON room.id = r.room_id
                 WHERE r.hotel_id = ?
                   AND room.room_number = ?
                   AND r.status = 'CHECKED_IN'
                """, Integer.class, command.hotelId(), roomNumber);
        if (checkedInRoomCount == null || checkedInRoomCount == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Room does not have an active check-in");
        }

        recordAuditUseCase.execute(new AuditEvent(
                command.hotelId(),
                "KIOSK",
                command.kioskId(),
                "GUEST_SERVICE_REQUESTED",
                command.serviceType().name(),
                roomNumber,
                "SUCCESS",
                correlationId,
                null
        ));
    }
}
