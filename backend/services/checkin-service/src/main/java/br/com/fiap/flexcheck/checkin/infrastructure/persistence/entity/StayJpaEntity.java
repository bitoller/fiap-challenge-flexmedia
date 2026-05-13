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
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_stay",
        uniqueConstraints = @UniqueConstraint(name = "uk_stay_reservation", columnNames = "reservation_id"),
        indexes = @Index(name = "ix_stay_status", columnList = "status, checked_in_at")
)
public class StayJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationJpaEntity reservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private RoomJpaEntity room;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "checked_in_at", nullable = false)
    private LocalDateTime checkedInAt;

    @Column(name = "expected_checkout_at", nullable = false)
    private LocalDateTime expectedCheckoutAt;

    @Column(name = "checked_out_at")
    private LocalDateTime checkedOutAt;

    protected StayJpaEntity() {
    }
}
