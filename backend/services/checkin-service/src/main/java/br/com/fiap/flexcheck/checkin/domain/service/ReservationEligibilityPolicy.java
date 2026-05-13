package br.com.fiap.flexcheck.checkin.domain.service;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.ReservationEligibility;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class ReservationEligibilityPolicy {

    public ReservationEligibility evaluate(Reservation reservation) {
        List<String> reasons = new ArrayList<>();
        LocalDate today = LocalDate.now();

        if (!"CONFIRMED".equalsIgnoreCase(reservation.status())) {
            reasons.add("RESERVATION_STATUS_" + reservation.status());
        }
        if (reservation.arrivalDate().isAfter(today.plusDays(1))) {
            reasons.add("CHECKIN_WINDOW_NOT_OPEN");
        }
        if (!reservation.departureDate().isAfter(today.minusDays(1))) {
            reasons.add("RESERVATION_EXPIRED");
        }
        if (reservation.room() == null || reservation.room().id() == null) {
            reasons.add("ROOM_NOT_ASSIGNED");
        } else if (!"AVAILABLE".equalsIgnoreCase(reservation.room().status())) {
            reasons.add("ROOM_NOT_AVAILABLE");
        }

        return new ReservationEligibility(reasons.isEmpty(), List.copyOf(reasons));
    }
}

