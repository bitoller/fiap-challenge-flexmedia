package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;

public record CheckinAddOnOfferResult(
        String code,
        String pricingType,
        BigDecimal unitAmount,
        Integer quantity,
        BigDecimal totalAmount,
        String currency,
        boolean selected
) {
}
