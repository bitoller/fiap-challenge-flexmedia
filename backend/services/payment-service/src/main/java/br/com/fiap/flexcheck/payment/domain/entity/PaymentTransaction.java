package br.com.fiap.flexcheck.payment.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentTransaction(
        Long id,
        Long stayId,
        Long reservationId,
        String transactionType,
        String status,
        BigDecimal amount,
        String currency,
        String provider,
        String authorizationCode,
        String idempotencyKey,
        LocalDateTime createdAt
) {
}
