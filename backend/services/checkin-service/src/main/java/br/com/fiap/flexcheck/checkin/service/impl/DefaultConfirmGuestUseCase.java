package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import br.com.fiap.flexcheck.checkin.repository.GuestRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultConfirmGuestUseCase implements ConfirmGuestUseCase {
    private final GuestRepository guestRepository;
    private final SessionRepository sessionRepository;
    private final AuditRepository auditRepository;

    public DefaultConfirmGuestUseCase(GuestRepository guestRepository, SessionRepository sessionRepository, AuditRepository auditRepository) {
        this.guestRepository = guestRepository;
        this.sessionRepository = sessionRepository;
        this.auditRepository = auditRepository;
    }

    @Override
    @Transactional
    public void execute(Long sessionId, GuestConfirmationCommand command) {
        guestRepository.updateGuest(command);
        sessionRepository.updateSessionStatus(sessionId, "DATA_CONFIRMED");
        auditRepository.record(new AuditEvent("KIOSK", null, "GUEST_DATA_CONFIRMED", "GUEST", String.valueOf(command.guestId()), "SUCCESS", null));
    }
}
