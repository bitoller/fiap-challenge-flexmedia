package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.CheckinSession;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.CreateSessionUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCreateSessionUseCase implements CreateSessionUseCase {
    private final SessionRepository sessionRepository;
    private final AuditServiceClient auditServiceClient;

    public DefaultCreateSessionUseCase(SessionRepository sessionRepository, AuditServiceClient auditServiceClient) {
        this.sessionRepository = sessionRepository;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    public SessionResult execute(CreateSessionCommand command) {
        CheckinSession session = sessionRepository.createSession(command.kioskId(), command.flowType(), command.language());
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent(
                command.kioskId(),
                "KIOSK",
                String.valueOf(command.kioskId()),
                "SESSION_STARTED",
                "CHECKIN_SESSION",
                String.valueOf(session.id()),
                "SUCCESS",
                session.correlationId()
        ));
        return new SessionResult(session.id(), session.status(), session.expiresAt(), session.correlationId());
    }
}
