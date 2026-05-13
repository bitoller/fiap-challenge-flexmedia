package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.service.result.PaymentResult;

import java.math.BigDecimal;

public interface PaymentServiceClient {
    PaymentResult recordPayment(Long stayId, Long reservationId, String type, String status, BigDecimal amount, String authorizationCode);
}
