package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import br.com.fiap.flexcheck.checkin.repository.ConsentRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.RegisterConsentsUseCase;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultRegisterConsentsUseCase implements RegisterConsentsUseCase {
    private final SessionRepository sessionRepository;
    private final ConsentRepository consentRepository;
    private final AuditRepository auditRepository;

    public DefaultRegisterConsentsUseCase(SessionRepository sessionRepository, ConsentRepository consentRepository, AuditRepository auditRepository) {
        this.sessionRepository = sessionRepository;
        this.consentRepository = consentRepository;
        this.auditRepository = auditRepository;
    }

    @Override
    @Transactional
    public void execute(Long sessionId, ConsentCommand command) {
        Long guestId = sessionRepository.findGuestIdBySession(sessionId);
        for (ConsentCommand.ConsentItemCommand item : command.items()) {
            consentRepository.saveConsent(sessionId, guestId, item);
        }
        auditRepository.record(new AuditEvent("KIOSK", null, "CONSENTS_REGISTERED", "CHECKIN_SESSION", String.valueOf(sessionId), "SUCCESS", null));
    }
}
