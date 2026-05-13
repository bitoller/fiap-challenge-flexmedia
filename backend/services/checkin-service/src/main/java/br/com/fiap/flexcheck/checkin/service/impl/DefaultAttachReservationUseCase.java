package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.AttachReservationUseCase;
import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultAttachReservationUseCase implements AttachReservationUseCase {
    private final SessionRepository sessionRepository;
    private final ReservationServiceClient reservationServiceClient;
    private final AuditServiceClient auditServiceClient;

    public DefaultAttachReservationUseCase(
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
    public SessionReservationResult execute(Long sessionId, AttachReservationCommand command) {
        var reservation = reservationServiceClient.search(command.searchType(), command.searchValue());
        if (!reservation.eligible()) {
            sessionRepository.failSession(sessionId, "RESERVATION_NOT_ELIGIBLE");
            throw new BusinessException(
                    "RESERVATION_NOT_ELIGIBLE",
                    "A reserva encontrada precisa de atendimento da recepcao.",
                    409
            );
        }

        sessionRepository.attachReservation(sessionId, reservation.id());
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent(
                "KIOSK",
                String.valueOf(reservation.id()),
                "RESERVATION_ATTACHED",
                "RESERVATION",
                String.valueOf(reservation.id()),
                "SUCCESS",
                null
        ));

        return new SessionReservationResult(
                sessionId,
                "RESERVATION_FOUND",
                reservation
        );
    }
}
