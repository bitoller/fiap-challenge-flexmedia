package br.com.fiap.flexcheck.payment.application.command;

import java.math.BigDecimal;

public record PaymentCommand(
        Long stayId,
        Long reservationId,
        String transactionType,
        String status,
        BigDecimal amount,
        String authorizationCode
) {
}
