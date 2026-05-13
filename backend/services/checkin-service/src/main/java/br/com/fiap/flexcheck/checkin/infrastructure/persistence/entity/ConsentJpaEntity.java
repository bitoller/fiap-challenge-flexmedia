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
@Table(name = "fc_consent")
public class ConsentJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private CheckinSessionJpaEntity session;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "guest_id", nullable = false)
    private GuestJpaEntity guest;

    @Column(name = "consent_type", nullable = false, length = 40)
    private String consentType;

    @Column(name = "accepted", nullable = false, length = 1)
    private String accepted;

    @Column(name = "version", nullable = false, length = 30)
    private String version;

    @Column(name = "accepted_at", nullable = false)
    private LocalDateTime acceptedAt;

    protected ConsentJpaEntity() {
    }
}
