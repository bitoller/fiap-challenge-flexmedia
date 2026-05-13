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

import java.time.LocalDateTime;

@Entity
@Table(name = "fc_device_event")
public class DeviceEventJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "kiosk_id", nullable = false)
    private KioskDeviceJpaEntity kiosk;

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType;

    @Column(name = "severity", nullable = false, length = 20)
    private String severity;

    @Column(name = "message", length = 500)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected DeviceEventJpaEntity() {
    }
}
