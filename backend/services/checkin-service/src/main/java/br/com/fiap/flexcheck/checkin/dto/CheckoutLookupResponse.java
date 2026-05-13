package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutLookupResponse(
        Long stayId,
        String stayStatus,
        ReservationResponse reservation,
        BigDecimal totalDue,
        List<CheckoutChargeResponse> charges
) {
}
