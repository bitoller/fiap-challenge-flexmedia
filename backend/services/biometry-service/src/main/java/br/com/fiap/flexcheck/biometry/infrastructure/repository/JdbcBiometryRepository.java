package br.com.fiap.flexcheck.biometry.infrastructure.repository;

import br.com.fiap.flexcheck.biometry.application.command.BiometryVerificationCommand;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class JdbcBiometryRepository {
    private final Map<Long, BiometryVerificationResult> store = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(1L);

    public BiometryVerificationResult insertVerification(
            Long sessionId,
            Long guestId,
            String status,
            String templateReference,
            BigDecimal score
    ) {
        Long id = sequence.getAndIncrement();
        BiometryVerificationResult result = new BiometryVerificationResult(
                id,
                sessionId,
                guestId,
                status,
                "MOCK",
                templateReference,
                score,
                LocalDateTime.now()
        );
        store.put(id, result);
        return result;
    }

    public BiometryVerificationResult findById(Long verificationId) {
        BiometryVerificationResult result = store.get(verificationId);
        if (result == null) {
            throw new NoSuchElementException("Biometry verification not found: " + verificationId);
        }
        return result;
    }

    public BiometryVerificationResult updateStatus(Long verificationId, String status) {
        BiometryVerificationResult current = findById(verificationId);
        BiometryVerificationResult updated = new BiometryVerificationResult(
                current.id(),
                current.sessionId(),
                current.guestId(),
                status,
                current.provider(),
                current.templateReference(),
                current.score(),
                current.verifiedAt()
        );
        store.put(verificationId, updated);
        return updated;
    }
}
