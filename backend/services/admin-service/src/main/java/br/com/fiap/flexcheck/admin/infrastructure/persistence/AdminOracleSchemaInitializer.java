package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class AdminOracleSchemaInitializer {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper;

    public AdminOracleSchemaInitializer(JdbcTemplate jdbc, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void initialize() {
        ensureColumn("FC_HOTEL", "OWNER_NAME", "ALTER TABLE fc_hotel ADD (owner_name VARCHAR2(160))");
        ensureColumn("FC_HOTEL", "ACTIVE", "ALTER TABLE fc_hotel ADD (active CHAR(1) DEFAULT 'Y')");
        ensureColumn("FC_HOTEL", "BRANDING_JSON", "ALTER TABLE fc_hotel ADD (branding_json CLOB)");
        ensureColumn("FC_HOTEL", "CONTENT_JSON", "ALTER TABLE fc_hotel ADD (content_json CLOB)");
        ensureColumn("FC_HOTEL", "UPDATED_AT", "ALTER TABLE fc_hotel ADD (updated_at TIMESTAMP)");
        ensureColumn("FC_AUDIT_LOG", "HOTEL_ID", "ALTER TABLE fc_audit_log ADD (hotel_id NUMBER)");
        jdbc.update("UPDATE fc_audit_log SET hotel_id = 1 WHERE hotel_id IS NULL");

        seedDefaultHotels();
        backfillHotelDefaults();
    }

    private void seedDefaultHotels() {
        for (var profile : DefaultHotelProfiles.all()) {
            Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM fc_hotel WHERE id = ?", Integer.class, profile.id());
            if (count != null && count > 0) {
                continue;
            }
            insertHotel(profile);
        }
    }

    private void backfillHotelDefaults() {
        List<Long> hotelIds = jdbc.query("""
                SELECT id
                  FROM fc_hotel
                 ORDER BY id
                """,
                (rs, rowNum) -> rs.getLong("id"));

        for (Long hotelId : hotelIds) {
            var profile = DefaultHotelProfiles.findDefault(hotelId);
            jdbc.update("""
                    UPDATE fc_hotel
                       SET owner_name = ?
                     WHERE id = ?
                       AND owner_name IS NULL
                    """,
                    profile.ownerName(),
                    hotelId
            );
            jdbc.update("""
                    UPDATE fc_hotel
                       SET active = ?
                     WHERE id = ?
                       AND active IS NULL
                    """,
                    profile.active() ? "Y" : "N",
                    hotelId
            );
            jdbc.update("""
                    UPDATE fc_hotel
                       SET branding_json = ?
                     WHERE id = ?
                       AND branding_json IS NULL
                    """,
                    toJson(profile.branding()),
                    hotelId
            );
            jdbc.update("""
                    UPDATE fc_hotel
                       SET content_json = ?
                     WHERE id = ?
                       AND content_json IS NULL
                    """,
                    toJson(profile.content()),
                    hotelId
            );
            jdbc.update("""
                    UPDATE fc_hotel
                       SET updated_at = ?
                     WHERE id = ?
                       AND updated_at IS NULL
                    """,
                    LocalDateTime.now(),
                    hotelId
            );
        }
    }

    private void insertHotel(br.com.fiap.flexcheck.admin.domain.entity.HotelProfile profile) {
        jdbc.update("""
                INSERT INTO fc_hotel (
                    id,
                    name,
                    owner_name,
                    timezone,
                    checkin_time,
                    checkout_time,
                    early_checkin_minutes,
                    late_checkout_minutes,
                    active,
                    created_at,
                    updated_at,
                    branding_json,
                    content_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                profile.id(),
                profile.name(),
                profile.ownerName(),
                profile.timezone(),
                profile.checkinTime(),
                profile.checkoutTime(),
                profile.earlyCheckinMinutes(),
                profile.lateCheckoutMinutes(),
                profile.active() ? "Y" : "N",
                profile.createdAt(),
                profile.updatedAt(),
                toJson(profile.branding()),
                toJson(profile.content())
        );
    }

    private void ensureColumn(String tableName, String columnName, String ddl) {
        Integer count = jdbc.queryForObject("""
                SELECT COUNT(*)
                  FROM user_tab_columns
                 WHERE table_name = ?
                   AND column_name = ?
                """, Integer.class, tableName, columnName);
        if (count != null && count > 0) {
            return;
        }
        jdbc.execute(ddl);
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Unable to serialize hotel profile data.", ex);
        }
    }
}
