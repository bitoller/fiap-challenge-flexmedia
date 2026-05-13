package br.com.fiap.flexcheck.checkin.repository;

import java.math.BigDecimal;

public interface PaymentRepository {
    Long insertPayment(Long stayId, Long reservationId, String type, String status, BigDecimal amount, String authorizationCode);
}

