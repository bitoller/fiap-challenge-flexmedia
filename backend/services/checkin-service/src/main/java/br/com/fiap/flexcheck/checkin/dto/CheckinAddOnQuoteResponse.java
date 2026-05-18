package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckinAddOnQuoteResponse(
        Long sessionId,
        ReservationResponse reservation,
        List<CheckinAddOnOfferResponse> offers,
        List<String> selectedCodes,
        BigDecimal baseAmount,
        BigDecimal addOnsTotal,
        BigDecimal totalAmount,
        String currency
) {
}
