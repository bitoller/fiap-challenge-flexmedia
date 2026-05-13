package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.checkin.mapper.ResultMapper;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import br.com.fiap.flexcheck.checkin.repository.ReservationRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.AttachReservationUseCase;
import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class DefaultAttachReservationUseCase implements AttachReservationUseCase {
    private final ReservationRepository reservationRepository;
    private final SessionRepository sessionRepository;
    private final AuditRepository auditRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultAttachReservationUseCase(
            ReservationRepository reservationRepository,
            SessionRepository sessionRepository,
            AuditRepository auditRepository,
            ReservationEligibilityPolicy eligibilityPolicy
    ) {
        this.reservationRepository = reservationRepository;
        this.sessionRepository = sessionRepository;
        this.auditRepository = auditRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    @Transactional
    public SessionReservationResult execute(Long sessionId, AttachReservationCommand command) {
        Reservation reservation = reservationRepository.findReservation(command.searchType(), command.searchValue())
                .orElseThrow(() -> new BusinessException(
                        "RESERVATION_NOT_FOUND",
                        "Nao encontramos uma reserva com esses dados.",
                        404,
                        Map.of("searchType", command.searchType())
                ));

        ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
        if (!eligibility.eligible()) {
            sessionRepository.failSession(sessionId, "RESERVATION_NOT_ELIGIBLE");
            throw new BusinessException(
                    "RESERVATION_NOT_ELIGIBLE",
                    "A reserva encontrada precisa de atendimento da recepcao.",
                    409,
                    Map.of("reasons", eligibility.reasons())
            );
        }

        sessionRepository.attachReservation(sessionId, reservation.id());
        auditRepository.record(new AuditEvent(
                "KIOSK",
                String.valueOf(reservation.kioskId()),
                "RESERVATION_ATTACHED",
                "RESERVATION",
                String.valueOf(reservation.id()),
                "SUCCESS",
                null
        ));

        return new SessionReservationResult(
                sessionId,
                "RESERVATION_FOUND",
                ResultMapper.toReservationResult(reservation, eligibility)
        );
    }
}
