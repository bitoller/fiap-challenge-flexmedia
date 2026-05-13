package br.com.fiap.flexcheck.reservation.mapper;

import br.com.fiap.flexcheck.reservation.domain.entity.Guest;
import br.com.fiap.flexcheck.reservation.domain.entity.Reservation;
import br.com.fiap.flexcheck.reservation.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.reservation.domain.entity.Room;
import br.com.fiap.flexcheck.reservation.service.result.GuestResult;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;
import br.com.fiap.flexcheck.reservation.service.result.RoomResult;

public final class ReservationMapper {
    private ReservationMapper() {
    }

    public static ReservationResult toResult(Reservation reservation, ReservationEligibility eligibility) {
        Guest guest = reservation.guest();
        Room room = reservation.room();
        return new ReservationResult(
                reservation.id(),
                reservation.code(),
                reservation.status(),
                reservation.hotelName(),
                reservation.arrivalDate(),
                reservation.departureDate(),
                reservation.totalAmount(),
                reservation.currency(),
                eligibility.eligible(),
                eligibility.reasons(),
                new GuestResult(
                        guest.id(),
                        guest.fullName(),
                        guest.documentType(),
                        maskDocument(guest.documentNumber()),
                        guest.birthDate(),
                        guest.email(),
                        guest.phone()
                ),
                room == null ? new RoomResult(null, null, null, null) : new RoomResult(room.id(), room.number(), room.type(), room.status())
        );
    }

    private static String maskDocument(String document) {
        if (document == null || document.length() < 4) {
            return "****";
        }
        return "****" + document.substring(document.length() - 4);
    }
}
