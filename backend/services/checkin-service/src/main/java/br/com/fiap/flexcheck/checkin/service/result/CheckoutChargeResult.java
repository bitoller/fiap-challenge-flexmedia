package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;

public record CheckoutChargeResult(
        String code,
        String description,
        BigDecimal amount
) {
}
