package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.domain.entity.CheckinSession;
import br.com.fiap.flexcheck.checkin.mapper.ResultMapper;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.CreateSessionUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCreateSessionUseCase implements CreateSessionUseCase {
    private final SessionRepository sessionRepository;
    private final AuditRepository auditRepository;

    public DefaultCreateSessionUseCase(SessionRepository sessionRepository, AuditRepository auditRepository) {
        this.sessionRepository = sessionRepository;
        this.auditRepository = auditRepository;
    }

    @Override
    public SessionResult execute(CreateSessionCommand command) {
        CheckinSession session = sessionRepository.createSession(command.kioskId(), command.flowType(), command.language());
        auditRepository.record(new AuditEvent(
                "KIOSK",
                String.valueOf(command.kioskId()),
                "SESSION_STARTED",
                "CHECKIN_SESSION",
                String.valueOf(session.id()),
                "SUCCESS",
                session.correlationId()
        ));
        return ResultMapper.toSessionResult(session);
    }
}
