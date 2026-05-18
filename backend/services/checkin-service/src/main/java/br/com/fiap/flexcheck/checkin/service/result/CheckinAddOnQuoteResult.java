package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;
import java.util.List;

public record CheckinAddOnQuoteResult(
        Long sessionId,
        ReservationResult reservation,
        List<CheckinAddOnOfferResult> offers,
        List<String> selectedCodes,
        BigDecimal baseAmount,
        BigDecimal addOnsTotal,
        BigDecimal totalAmount,
        String currency
) {
}
