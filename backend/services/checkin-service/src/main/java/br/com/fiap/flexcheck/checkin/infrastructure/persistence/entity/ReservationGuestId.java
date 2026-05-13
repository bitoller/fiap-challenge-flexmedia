package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ReservationGuestId implements Serializable {
    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(name = "guest_id")
    private Long guestId;

    protected ReservationGuestId() {
    }

    public ReservationGuestId(Long reservationId, Long guestId) {
        this.reservationId = reservationId;
        this.guestId = guestId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof ReservationGuestId that)) {
            return false;
        }
        return Objects.equals(reservationId, that.reservationId) && Objects.equals(guestId, that.guestId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reservationId, guestId);
    }
}
