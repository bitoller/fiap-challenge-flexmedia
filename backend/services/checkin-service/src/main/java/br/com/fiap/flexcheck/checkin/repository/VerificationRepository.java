package br.com.fiap.flexcheck.checkin.repository;

public interface VerificationRepository {
    void insertDocumentVerification(Long sessionId, Long guestId, String status);
}

