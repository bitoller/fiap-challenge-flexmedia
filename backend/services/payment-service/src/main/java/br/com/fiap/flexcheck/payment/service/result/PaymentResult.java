package br.com.fiap.flexcheck.payment.service.result;

import java.math.BigDecimal;

public record PaymentResult(
        Long id,
        String transactionType,
        String status,
        BigDecimal amount,
        String authorizationCode
) {
}
