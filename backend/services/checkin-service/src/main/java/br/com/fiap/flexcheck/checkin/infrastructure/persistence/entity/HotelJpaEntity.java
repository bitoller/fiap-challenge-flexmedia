package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "fc_hotel")
public class HotelJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 160)
    private String name;

    @Column(name = "timezone", nullable = false, length = 80)
    private String timezone;

    @Column(name = "checkin_time", nullable = false, length = 5)
    private String checkinTime;

    @Column(name = "checkout_time", nullable = false, length = 5)
    private String checkoutTime;

    @Column(name = "early_checkin_minutes", nullable = false)
    private Integer earlyCheckinMinutes;

    @Column(name = "late_checkout_minutes", nullable = false)
    private Integer lateCheckoutMinutes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected HotelJpaEntity() {
    }
}
