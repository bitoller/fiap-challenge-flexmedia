package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.ConsentRepository;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class JdbcConsentRepository implements ConsentRepository {
    private final JdbcTemplate jdbc;

    public JdbcConsentRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void saveConsent(Long sessionId, Long guestId, ConsentCommand.ConsentItemCommand item) {
        jdbc.update("""
                INSERT INTO fc_consent (session_id, guest_id, consent_type, accepted, version, accepted_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, sessionId, guestId, item.type().toUpperCase(), item.accepted() ? "Y" : "N", item.version(),
                Timestamp.valueOf(LocalDateTime.now()));
    }
}
