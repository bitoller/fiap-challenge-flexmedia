package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.BiometryVerificationResult;

public interface BiometryServiceClient {
    BiometryVerificationResult recordVerification(Long sessionId, Long guestId, String requestedStatus);
}
