package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.service.result.BiometricReferenceCandidateResult;

import java.math.BigDecimal;
import java.util.List;

public interface BiometricReferenceRepository {
    void saveFaceReference(
            Long sessionId,
            Long reservationId,
            Long guestId,
            Long hotelId,
            String provider,
            String imageBase64,
            String mimeType,
            BigDecimal score
    );

    List<BiometricReferenceCandidateResult> findActiveCheckoutCandidates(Long hotelId);
}
