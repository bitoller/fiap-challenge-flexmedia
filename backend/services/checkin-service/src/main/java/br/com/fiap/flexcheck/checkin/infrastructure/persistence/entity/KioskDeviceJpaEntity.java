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

import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_kiosk_device",
        uniqueConstraints = @UniqueConstraint(name = "uk_kiosk_code", columnNames = "device_code")
)
public class KioskDeviceJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hotel_id", nullable = false)
    private HotelJpaEntity hotel;

    @Column(name = "device_code", nullable = false, length = 60)
    private String deviceCode;

    @Column(name = "name", nullable = false, length = 120)
    private String name;

    @Column(name = "status", nullable = false, length = 30)
    private String status;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected KioskDeviceJpaEntity() {
    }
}
