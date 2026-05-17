package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.repository.ConsentRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.RegisterConsentsUseCase;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import br.com.fiap.flexcheck.checkin.domain.entity.SessionContext;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultRegisterConsentsUseCase implements RegisterConsentsUseCase {
    private final SessionRepository sessionRepository;
    private final ConsentRepository consentRepository;
    private final AuditServiceClient auditServiceClient;

    public DefaultRegisterConsentsUseCase(SessionRepository sessionRepository, ConsentRepository consentRepository, AuditServiceClient auditServiceClient) {
        this.sessionRepository = sessionRepository;
        this.consentRepository = consentRepository;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    @Transactional
    public void execute(Long sessionId, ConsentCommand command) {
        SessionContext sessionContext = sessionRepository.findSessionContext(sessionId)
                .orElseThrow(() -> new BusinessException("SESSION_NOT_FOUND", "Session not found.", 404));
        Long guestId = sessionContext.reservation().guest().id();
        Long hotelId = sessionContext.reservation().hotelId();
        for (ConsentCommand.ConsentItemCommand item : command.items()) {
            consentRepository.saveConsent(sessionId, guestId, item);
        }
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent(hotelId, "KIOSK", null, "CONSENTS_REGISTERED", "CHECKIN_SESSION", String.valueOf(sessionId), "SUCCESS", null));
    }
}
