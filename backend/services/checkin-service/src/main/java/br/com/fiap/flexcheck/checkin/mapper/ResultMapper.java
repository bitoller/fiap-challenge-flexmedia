package br.com.fiap.flexcheck.checkin.mapper;

import br.com.fiap.flexcheck.checkin.domain.entity.CheckinSession;
import br.com.fiap.flexcheck.checkin.domain.entity.Dashboard;
import br.com.fiap.flexcheck.checkin.domain.entity.KeyCredential;
import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.checkin.domain.entity.Room;
import br.com.fiap.flexcheck.checkin.service.result.DashboardResult;
import br.com.fiap.flexcheck.checkin.service.result.GuestResult;
import br.com.fiap.flexcheck.checkin.service.result.KeyResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.RoomResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;

public final class ResultMapper {
    private ResultMapper() {
    }

    public static SessionResult toSessionResult(CheckinSession session) {
        return new SessionResult(session.id(), session.status(), session.expiresAt(), session.correlationId());
    }

    public static ReservationResult toReservationResult(Reservation reservation, ReservationEligibility eligibility) {
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
                        reservation.guest().id(),
                        reservation.guest().fullName(),
                        reservation.guest().documentType(),
                        maskDocument(reservation.guest().documentNumber()),
                        reservation.guest().birthDate(),
                        reservation.guest().email(),
                        reservation.guest().phone()
                ),
                room == null ? new RoomResult(null, null, null, null) : new RoomResult(room.id(), room.number(), room.type(), room.status())
        );
    }

    public static KeyResult toKeyResult(KeyCredential key) {
        return new KeyResult(key.id(), key.type(), key.status(), key.value(), key.expiresAt());
    }

    public static DashboardResult toDashboardResult(Dashboard dashboard) {
        return new DashboardResult(
                dashboard.reservationsToday(),
                dashboard.activeStays(),
                dashboard.completedCheckins(),
                dashboard.completedCheckouts(),
                dashboard.failedSessions(),
                dashboard.recentSessions()
        );
    }

    private static String maskDocument(String document) {
        if (document == null || document.length() < 4) {
            return "****";
        }
        return "****" + document.substring(document.length() - 4);
    }
}
