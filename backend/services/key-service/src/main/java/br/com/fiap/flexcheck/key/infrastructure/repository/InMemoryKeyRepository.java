package br.com.fiap.flexcheck.key.infrastructure.repository;

import br.com.fiap.flexcheck.key.domain.entity.KeyCredential;
import br.com.fiap.flexcheck.key.service.result.KeyResult;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryKeyRepository {
    private final AtomicLong sequence = new AtomicLong(1L);
    private final ConcurrentMap<Long, KeyCredential> keys = new ConcurrentHashMap<>();

    public KeyResult createKey(Long stayId, Long roomId, String keyType, LocalDate departureDate) {
        LocalDateTime issuedAt = LocalDateTime.now();
        LocalDateTime expiresAt = LocalDateTime.of(departureDate, LocalTime.NOON);
        String type = keyType == null || keyType.isBlank() ? "DIGITAL" : keyType.toUpperCase();
        String keyValue = "KEY-" + stayId + "-" + roomId;

        Long keyId = sequence.getAndIncrement();
        keys.put(keyId, new KeyCredential(
                keyId,
                stayId,
                roomId,
                type,
                "ACTIVE",
                keyValue,
                issuedAt,
                expiresAt
        ));
        return new KeyResult(keyId, type, "ACTIVE", keyValue, expiresAt);
    }

    public void revokeKeys(Long stayId) {
        keys.replaceAll((id, credential) -> {
            if (credential.stayId() != null && credential.stayId().equals(stayId) && "ACTIVE".equals(credential.status())) {
                return new KeyCredential(
                        credential.id(),
                        credential.stayId(),
                        credential.roomId(),
                        credential.type(),
                        "REVOKED",
                        credential.value(),
                        credential.issuedAt(),
                        credential.expiresAt()
                );
            }
            return credential;
        });
    }
}
