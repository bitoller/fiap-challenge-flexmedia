package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.repository.BiometricReferenceRepository;
import br.com.fiap.flexcheck.checkin.service.result.BiometricReferenceCandidateResult;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public class JdbcBiometricReferenceRepository implements BiometricReferenceRepository {
    private final JdbcTemplate jdbc;

    public JdbcBiometricReferenceRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void saveFaceReference(
            Long sessionId,
            Long reservationId,
            Long guestId,
            Long hotelId,
            String provider,
            String imageBase64,
            String mimeType,
            BigDecimal score
    ) {
        jdbc.update("""
                        UPDATE fc_biometric_reference
                           SET status = 'REVOKED'
                         WHERE reservation_id = ?
                           AND guest_id = ?
                           AND status = 'ACTIVE'
                        """,
                reservationId,
                guestId
        );

        jdbc.update("""
                        INSERT INTO fc_biometric_reference (
                            session_id,
                            reservation_id,
                            guest_id,
                            hotel_id,
                            provider,
                            status,
                            image_base64,
                            mime_type,
                            score,
                            created_at
                        ) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?, ?, ?)
                        """,
                sessionId,
                reservationId,
                guestId,
                hotelId,
                provider,
                imageBase64,
                mimeType == null || mimeType.isBlank() ? "image/jpeg" : mimeType,
                score,
                Timestamp.valueOf(LocalDateTime.now())
        );
    }

    @Override
    public List<BiometricReferenceCandidateResult> findActiveCheckoutCandidates(Long hotelId) {
        return jdbc.query("""
                        SELECT st.id AS stay_id,
                               r.id AS reservation_id,
                               g.id AS guest_id,
                               br.image_base64,
                               br.mime_type
                          FROM fc_biometric_reference br
                          JOIN fc_reservation r ON r.id = br.reservation_id
                          JOIN fc_stay st ON st.reservation_id = r.id
                          JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                          JOIN fc_guest g ON g.id = rg.guest_id AND g.id = br.guest_id
                         WHERE br.hotel_id = ?
                           AND br.status = 'ACTIVE'
                           AND UPPER(st.status) IN ('ACTIVE', 'PENDING_KEY')
                           AND UPPER(r.status) IN ('CHECKED_IN', 'ACTIVE')
                         ORDER BY br.created_at DESC
                        """,
                (rs, rowNum) -> new BiometricReferenceCandidateResult(
                        rs.getLong("stay_id"),
                        rs.getLong("reservation_id"),
                        rs.getLong("guest_id"),
                        rs.getString("image_base64"),
                        rs.getString("mime_type")
                ),
                hotelId
        );
    }
}
