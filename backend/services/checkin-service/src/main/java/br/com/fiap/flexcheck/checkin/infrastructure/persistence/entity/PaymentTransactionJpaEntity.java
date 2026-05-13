package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_payment_transaction",
        uniqueConstraints = @UniqueConstraint(name = "uk_payment_idempotency", columnNames = "idempotency_key")
)
public class PaymentTransactionJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stay_id")
    private StayJpaEntity stay;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationJpaEntity reservation;

    @Column(name = "transaction_type", nullable = false, length = 30)
    private String transactionType;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "provider", nullable = false, length = 60)
    private String provider;

    @Column(name = "authorization_code", length = 80)
    private String authorizationCode;

    @Column(name = "idempotency_key", length = 120)
    private String idempotencyKey;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected PaymentTransactionJpaEntity() {
    }
}
