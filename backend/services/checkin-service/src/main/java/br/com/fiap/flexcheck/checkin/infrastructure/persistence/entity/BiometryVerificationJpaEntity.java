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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fc_biometry_verification")
public class BiometryVerificationJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private CheckinSessionJpaEntity session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guest_id", nullable = false)
    private GuestJpaEntity guest;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "provider", nullable = false, length = 60)
    private String provider;

    @Column(name = "template_reference", length = 160)
    private String templateReference;

    @Column(name = "score", precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "verified_at", nullable = false)
    private LocalDateTime verifiedAt;

    protected BiometryVerificationJpaEntity() {
    }
}
