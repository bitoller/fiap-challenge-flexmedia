package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.repository.CheckinAddOnRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.service.ApplyCheckinAddOnsUseCase;
import br.com.fiap.flexcheck.checkin.service.command.ApplyCheckinAddOnsCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnOfferResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnQuoteResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class DefaultApplyCheckinAddOnsUseCase implements ApplyCheckinAddOnsUseCase {
    private final SessionRepository sessionRepository;
    private final ReservationServiceClient reservationServiceClient;
    private final CheckinAddOnRepository addOnRepository;
    private final CheckinAddOnCatalog catalog;

    public DefaultApplyCheckinAddOnsUseCase(
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
    @Transactional
    public CheckinAddOnQuoteResult execute(Long sessionId, ApplyCheckinAddOnsCommand command) {
        Long reservationId = sessionRepository.findReservationIdBySession(sessionId);
        if (reservationId == null) {
            throw new BusinessException("RESERVATION_NOT_ATTACHED", "Reservation not attached to session.", 409);
        }

        ReservationResult currentReservation = reservationServiceClient.findById(reservationId);
        BigDecimal baseAmount = addOnRepository.findBaseAmount(
                currentReservation.id(),
                sessionId,
                currentReservation.totalAmount()
        );
        Set<String> selectedCodes = normalizeSelectedCodes(command.selectedCodes());
        List<CheckinAddOnOfferResult> selectedOffers = catalog.listFor(currentReservation, selectedCodes).stream()
                .filter(CheckinAddOnOfferResult::selected)
                .toList();

        addOnRepository.replaceSelection(currentReservation.id(), sessionId, baseAmount, selectedOffers);

        ReservationResult updatedReservation = reservationServiceClient.findById(reservationId);
        var refreshedCodes = addOnRepository.findSelectedCodes(updatedReservation.id(), sessionId);
        BigDecimal addOnsTotal = addOnRepository.findSelectedTotal(updatedReservation.id(), sessionId);
        BigDecimal totalAmount = baseAmount.add(addOnsTotal);

        return new CheckinAddOnQuoteResult(
                sessionId,
                updatedReservation,
                catalog.listFor(updatedReservation, refreshedCodes),
                refreshedCodes.stream().toList(),
                baseAmount,
                addOnsTotal,
                totalAmount,
                updatedReservation.currency()
        );
    }

    private Set<String> normalizeSelectedCodes(List<String> selectedCodes) {
        Set<String> normalized = new LinkedHashSet<>();
        if (selectedCodes == null) {
            return normalized;
        }

        selectedCodes.stream()
                .filter(code -> code != null && !code.isBlank())
                .map(code -> code.trim().toUpperCase())
                .forEach(normalized::add);
        return normalized;
    }
}
