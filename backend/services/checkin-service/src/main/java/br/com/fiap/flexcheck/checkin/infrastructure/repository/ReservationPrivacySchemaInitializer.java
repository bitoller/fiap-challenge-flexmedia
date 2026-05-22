package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.security.SensitiveDataCodec;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
class ReservationPrivacySchemaInitializer {
    private final JdbcTemplate jdbc;
    private final SensitiveDataCodec sensitiveDataCodec;

    ReservationPrivacySchemaInitializer(JdbcTemplate jdbc, SensitiveDataCodec sensitiveDataCodec) {
        this.jdbc = jdbc;
        this.sensitiveDataCodec = sensitiveDataCodec;
    }

    @PostConstruct
    void initialize() {
        modifyColumn("ALTER TABLE fc_guest MODIFY document_number VARCHAR2(128)");
        addColumn("ALTER TABLE fc_reservation ADD guest_document_hash VARCHAR2(128)");
        addColumn("ALTER TABLE fc_reservation ADD guest_document_encrypted VARCHAR2(4000)");
        addColumn("ALTER TABLE fc_reservation ADD guest_email_encrypted VARCHAR2(4000)");
        addColumn("ALTER TABLE fc_reservation ADD guest_phone_encrypted VARCHAR2(4000)");
        backfillReservationSensitiveData();
    }

    private void addColumn(String sql) {
        try {
            jdbc.execute(sql);
        } catch (DataAccessException ignored) {
        }
    }

    private void modifyColumn(String sql) {
        try {
            jdbc.execute(sql);
        } catch (DataAccessException ignored) {
        }
    }

    private void backfillReservationSensitiveData() {
        var rows = jdbc.query("""
                        SELECT r.id,
                               g.document_type,
                               g.document_number,
                               g.email,
                               g.phone
                          FROM fc_reservation r
                          JOIN fc_reservation_guest rg ON rg.reservation_id = r.id AND rg.is_primary = 'Y'
                          JOIN fc_guest g ON g.id = rg.guest_id
                         WHERE r.guest_document_hash IS NULL
                            OR r.guest_document_encrypted IS NULL
                            OR (r.guest_email_encrypted IS NULL AND g.email IS NOT NULL)
                            OR (r.guest_phone_encrypted IS NULL AND g.phone IS NOT NULL)
                        """,
                (rs, rowNum) -> new SensitiveReservationRow(
                        rs.getLong("id"),
                        rs.getString("document_type"),
                        rs.getString("document_number"),
                        rs.getString("email"),
                        rs.getString("phone")
                )
        );
        for (SensitiveReservationRow row : rows) {
            jdbc.update("""
                            UPDATE fc_reservation
                               SET guest_document_hash = COALESCE(guest_document_hash, ?),
                                   guest_document_encrypted = COALESCE(guest_document_encrypted, ?),
                                   guest_email_encrypted = COALESCE(guest_email_encrypted, ?),
                                   guest_phone_encrypted = COALESCE(guest_phone_encrypted, ?)
                             WHERE id = ?
                            """,
                    sensitiveDataCodec.documentHash(row.documentType(), row.documentNumber()),
                    sensitiveDataCodec.encrypt(row.documentNumber()),
                    sensitiveDataCodec.encrypt(row.email()),
                    sensitiveDataCodec.encrypt(row.phone()),
                    row.reservationId()
            );
        }
    }

    private record SensitiveReservationRow(
            Long reservationId,
            String documentType,
            String documentNumber,
            String email,
            String phone
    ) {
    }
}
