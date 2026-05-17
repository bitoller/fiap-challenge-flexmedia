package br.com.fiap.flexcheck.checkin.repository;

import java.math.BigDecimal;
import java.util.Optional;

public interface VerificationRepository {
    void insertDocumentVerification(Long sessionId, Long guestId, String status);

    void insertDocumentVerification(Long sessionId, Long guestId, String status, String provider, String referenceCode);

    void insertBiometryVerification(Long sessionId, Long guestId, String status, String provider, String templateReference, BigDecimal score);

    Optional<String> findLatestDocumentStatus(Long sessionId);

    Optional<String> findLatestBiometryStatus(Long sessionId);
}

