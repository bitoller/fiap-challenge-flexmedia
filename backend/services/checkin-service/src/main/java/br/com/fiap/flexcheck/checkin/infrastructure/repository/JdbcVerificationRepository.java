package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Repository
public class JdbcVerificationRepository implements VerificationRepository {
    private final JdbcTemplate jdbc;

    public JdbcVerificationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void insertDocumentVerification(Long sessionId, Long guestId, String status) {
        jdbc.update("""
                INSERT INTO fc_document_verification (session_id, guest_id, status, provider, reference_code, verified_at)
                VALUES (?, ?, ?, 'MOCK', ?, ?)
                """, sessionId, guestId, status, "DOC-" + sessionId, Timestamp.valueOf(LocalDateTime.now()));
    }
}
