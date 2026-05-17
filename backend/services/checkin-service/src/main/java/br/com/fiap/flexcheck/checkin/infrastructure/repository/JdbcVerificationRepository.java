package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcVerificationRepository implements VerificationRepository {
    private final JdbcTemplate jdbc;

    public JdbcVerificationRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void insertDocumentVerification(Long sessionId, Long guestId, String status) {
        insertDocumentVerification(sessionId, guestId, status, "MOCK", "DOC-" + sessionId);
    }

    @Override
    public void insertDocumentVerification(Long sessionId, Long guestId, String status, String provider, String referenceCode) {
        jdbc.update("""
                INSERT INTO fc_document_verification (session_id, guest_id, status, provider, reference_code, verified_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """, sessionId, guestId, status, provider, referenceCode, Timestamp.valueOf(LocalDateTime.now()));
    }

    @Override
    public void insertBiometryVerification(Long sessionId, Long guestId, String status, String provider, String templateReference, BigDecimal score) {
        jdbc.update("""
                INSERT INTO fc_biometry_verification (session_id, guest_id, status, provider, template_reference, score, verified_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, sessionId, guestId, status, provider, templateReference, score, Timestamp.valueOf(LocalDateTime.now()));
    }

    @Override
    public Optional<String> findLatestDocumentStatus(Long sessionId) {
        List<String> statuses = jdbc.query("""
                SELECT status
                  FROM fc_document_verification
                 WHERE session_id = ?
                 ORDER BY verified_at DESC, id DESC
                 FETCH FIRST 1 ROWS ONLY
                """, (rs, rowNum) -> rs.getString("status"), sessionId);
        return statuses.stream().findFirst();
    }

    @Override
    public Optional<String> findLatestBiometryStatus(Long sessionId) {
        List<String> statuses = jdbc.query("""
                SELECT status
                  FROM fc_biometry_verification
                 WHERE session_id = ?
                 ORDER BY verified_at DESC, id DESC
                 FETCH FIRST 1 ROWS ONLY
                """, (rs, rowNum) -> rs.getString("status"), sessionId);
        return statuses.stream().findFirst();
    }
}
