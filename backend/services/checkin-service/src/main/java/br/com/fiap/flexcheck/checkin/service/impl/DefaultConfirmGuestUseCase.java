package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultConfirmGuestUseCase implements ConfirmGuestUseCase {
    private final SessionRepository sessionRepository;
    private final ReservationServiceClient reservationServiceClient;
    private final AuditServiceClient auditServiceClient;

    public DefaultConfirmGuestUseCase(
            SessionRepository sessionRepository,
            ReservationServiceClient reservationServiceClient,
            AuditServiceClient auditServiceClient
    ) {
        this.sessionRepository = sessionRepository;
        this.reservationServiceClient = reservationServiceClient;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    @Transactional
    public void execute(Long sessionId, GuestConfirmationCommand command) {
        Long reservationId = sessionRepository.findReservationIdBySession(sessionId);
        reservationServiceClient.confirmGuest(reservationId, command);
        sessionRepository.updateSessionStatus(sessionId, "DATA_CONFIRMED");
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent("KIOSK", null, "GUEST_DATA_CONFIRMED", "GUEST", String.valueOf(command.guestId()), "SUCCESS", null));
    }
}
