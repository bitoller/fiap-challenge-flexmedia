package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "fc_reservation_guest")
public class ReservationGuestJpaEntity {
    @EmbeddedId
    private ReservationGuestId id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("reservationId")
    @JoinColumn(name = "reservation_id", nullable = false)
    private ReservationJpaEntity reservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("guestId")
    @JoinColumn(name = "guest_id", nullable = false)
    private GuestJpaEntity guest;

    @Column(name = "is_primary", nullable = false, length = 1)
    private String primary;

    protected ReservationGuestJpaEntity() {
    }
}
