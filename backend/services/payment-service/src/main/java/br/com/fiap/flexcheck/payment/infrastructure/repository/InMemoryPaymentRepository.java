package br.com.fiap.flexcheck.payment.infrastructure.repository;

import br.com.fiap.flexcheck.payment.domain.entity.PaymentTransaction;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryPaymentRepository {
    private final AtomicLong sequence = new AtomicLong(1L);
    private final ConcurrentMap<Long, PaymentTransaction> payments = new ConcurrentHashMap<>();

    public Long insertPayment(Long stayId, Long reservationId, String type, String status, BigDecimal amount, String authorizationCode) {
        Long id = sequence.getAndIncrement();
        PaymentTransaction payment = new PaymentTransaction(
                id,
                stayId,
                reservationId,
                type,
                status,
                amount,
                "BRL",
                "MOCK",
                authorizationCode,
                UUID.randomUUID().toString(),
                LocalDateTime.now()
        );
        payments.put(id, payment);
        return id;
    }
}
