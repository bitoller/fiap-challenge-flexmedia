package br.com.fiap.flexcheck.checkin.infrastructure.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.KeyCredential;
import br.com.fiap.flexcheck.checkin.repository.KeyRepository;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Repository
public class JdbcKeyRepository implements KeyRepository {
    private final SimpleJdbcInsert keyInsert;

    public JdbcKeyRepository(DataSource dataSource) {
        this.keyInsert = new SimpleJdbcInsert(dataSource)
                .withTableName("fc_key_credential")
                .usingGeneratedKeyColumns("id");
    }

    @Override
    public KeyCredential createKey(Long stayId, Long roomId, String keyType, LocalDate departureDate) {
        LocalDateTime expiresAt = LocalDateTime.of(departureDate, LocalTime.NOON);
        String type = keyType == null || keyType.isBlank() ? "DIGITAL" : keyType.toUpperCase();
        String keyValue = "KEY-" + stayId + "-" + roomId;

        Map<String, Object> values = new HashMap<>();
        values.put("stay_id", stayId);
        values.put("room_id", roomId);
        values.put("key_type", type);
        values.put("status", "ACTIVE");
        values.put("key_value", keyValue);
        values.put("issued_at", Timestamp.valueOf(LocalDateTime.now()));
        values.put("expires_at", Timestamp.valueOf(expiresAt));

        Long keyId = keyInsert.executeAndReturnKey(values).longValue();
        return new KeyCredential(keyId, type, "ACTIVE", keyValue, expiresAt);
    }
}
