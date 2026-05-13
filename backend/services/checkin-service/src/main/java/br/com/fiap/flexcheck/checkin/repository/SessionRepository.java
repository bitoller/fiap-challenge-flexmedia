package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.CheckinSession;
import br.com.fiap.flexcheck.checkin.domain.entity.SessionContext;

import java.util.Optional;

public interface SessionRepository {
    CheckinSession createSession(Long kioskId, String flowType, String language);

    void attachReservation(Long sessionId, Long reservationId);

    void failSession(Long sessionId, String reason);

    void updateSessionStatus(Long sessionId, String status);

    Long findGuestIdBySession(Long sessionId);

    Optional<SessionContext> findSessionContext(Long sessionId);
}

