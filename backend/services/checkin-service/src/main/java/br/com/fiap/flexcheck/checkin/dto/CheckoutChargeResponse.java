package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;

public record CheckoutChargeResponse(
        String code,
        String description,
        BigDecimal amount
) {
}
