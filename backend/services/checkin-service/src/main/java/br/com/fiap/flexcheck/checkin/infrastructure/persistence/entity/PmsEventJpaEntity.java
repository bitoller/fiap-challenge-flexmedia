package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "fc_pms_event")
public class PmsEventJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationJpaEntity reservation;

    @Column(name = "event_type", nullable = false, length = 80)
    private String eventType;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Lob
    @Column(name = "payload")
    private String payload;

    @Column(name = "attempts", nullable = false)
    private Integer attempts;

    @Column(name = "last_attempt_at")
    private LocalDateTime lastAttemptAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected PmsEventJpaEntity() {
    }
}
