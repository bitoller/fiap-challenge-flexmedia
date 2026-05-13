package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.GuestRepository;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class JdbcGuestRepository implements GuestRepository {
    private final JdbcTemplate jdbc;

    public JdbcGuestRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void updateGuest(GuestConfirmationCommand command) {
        int updated = jdbc.update("""
                UPDATE fc_guest
                   SET full_name = ?,
                       document_type = ?,
                       document_number = ?,
                       birth_date = ?,
                       email = ?,
                       phone = ?,
                       updated_at = ?
                 WHERE id = ?
                """,
                command.fullName(),
                command.documentType(),
                command.documentNumber(),
                Date.valueOf(command.birthDate()),
                command.email(),
                command.phone(),
                Timestamp.valueOf(LocalDateTime.now()),
                command.guestId()
        );
        if (updated == 0) {
            throw new BusinessException("GUEST_NOT_FOUND", "Hospede nao encontrado.", 404);
        }
    }
}
