package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;

public record CheckoutResponse(
        Long stayId,
        String status,
        BigDecimal totalPaid,
        String receiptCode
) {
}
