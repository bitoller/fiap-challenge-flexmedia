package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;

public record CheckinAddOnOfferResponse(
        String code,
        String pricingType,
        BigDecimal unitAmount,
        Integer quantity,
        BigDecimal totalAmount,
        String currency,
        boolean selected
) {
}
