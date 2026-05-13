package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;

public record CheckoutResult(
        Long stayId,
        String status,
        BigDecimal totalPaid,
        String receiptCode
) {
}

