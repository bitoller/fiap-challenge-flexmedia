package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.repository.CheckinAddOnRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.ListCheckinAddOnsUseCase;
import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnQuoteResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DefaultListCheckinAddOnsUseCase implements ListCheckinAddOnsUseCase {
    private final SessionRepository sessionRepository;
    private final ReservationServiceClient reservationServiceClient;
    private final CheckinAddOnRepository addOnRepository;
    private final CheckinAddOnCatalog catalog;

    public DefaultListCheckinAddOnsUseCase(
            SessionRepository sessionRepository,
            ReservationServiceClient reservationServiceClient,
            CheckinAddOnRepository addOnRepository,
            CheckinAddOnCatalog catalog
    ) {
        this.sessionRepository = sessionRepository;
        this.reservationServiceClient = reservationServiceClient;
        this.addOnRepository = addOnRepository;
        this.catalog = catalog;
    }

    @Override
    public CheckinAddOnQuoteResult execute(Long sessionId) {
        Long reservationId = sessionRepository.findReservationIdBySession(sessionId);
        if (reservationId == null) {
            throw new BusinessException("RESERVATION_NOT_ATTACHED", "Reservation not attached to session.", 409);
        }

        ReservationResult reservation = reservationServiceClient.findById(reservationId);
        var selectedCodes = addOnRepository.findSelectedCodes(reservation.id(), sessionId);
        BigDecimal addOnsTotal = addOnRepository.findSelectedTotal(reservation.id(), sessionId);
        BigDecimal baseAmount = addOnRepository.findBaseAmount(reservation.id(), sessionId, reservation.totalAmount());

        return new CheckinAddOnQuoteResult(
                sessionId,
                reservation,
                catalog.listFor(reservation, selectedCodes),
                selectedCodes.stream().toList(),
                baseAmount,
                addOnsTotal,
                baseAmount.add(addOnsTotal),
                reservation.currency()
        );
    }
}
