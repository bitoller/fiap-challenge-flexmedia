package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_checkin_session",
        indexes = @Index(name = "ix_session_status", columnList = "status, started_at")
)
public class CheckinSessionJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "kiosk_id", nullable = false)
    private KioskDeviceJpaEntity kiosk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private ReservationJpaEntity reservation;

    @Column(name = "flow_type", nullable = false, length = 20)
    private String flowType;

    @Column(name = "status", nullable = false, length = 40)
    private String status;

    @Column(name = "language", nullable = false, length = 10)
    private String language;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "failure_reason", length = 120)
    private String failureReason;

    @Column(name = "correlation_id", length = 80)
    private String correlationId;

    protected CheckinSessionJpaEntity() {
    }
}
