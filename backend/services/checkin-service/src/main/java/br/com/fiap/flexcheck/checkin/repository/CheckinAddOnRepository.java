package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnOfferResult;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

public interface CheckinAddOnRepository {
    Set<String> findSelectedCodes(Long reservationId, Long sessionId);

    BigDecimal findSelectedTotal(Long reservationId, Long sessionId);

    BigDecimal findBaseAmount(Long reservationId, Long sessionId, BigDecimal currentTotalAmount);

    void replaceSelection(Long reservationId, Long sessionId, BigDecimal baseAmount, List<CheckinAddOnOfferResult> selectedOffers);

    void commitReservationTotal(Long reservationId, BigDecimal totalAmount);
}
