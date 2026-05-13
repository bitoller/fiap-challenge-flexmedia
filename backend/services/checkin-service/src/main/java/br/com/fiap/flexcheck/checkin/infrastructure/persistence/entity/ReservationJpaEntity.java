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

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_reservation",
        uniqueConstraints = @UniqueConstraint(name = "uk_reservation_code", columnNames = "reservation_code"),
        indexes = @Index(name = "ix_reservation_dates", columnList = "hotel_id, arrival_date, departure_date")
)
public class ReservationJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private HotelJpaEntity hotel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private RoomJpaEntity room;

    @Column(name = "reservation_code", nullable = false, length = 40)
    private String reservationCode;

    @Column(name = "pms_external_id", length = 80)
    private String pmsExternalId;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "arrival_date", nullable = false)
    private LocalDate arrivalDate;

    @Column(name = "departure_date", nullable = false)
    private LocalDate departureDate;

    @Column(name = "adults", nullable = false)
    private Integer adults;

    @Column(name = "children", nullable = false)
    private Integer children;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    protected ReservationJpaEntity() {
    }
}
