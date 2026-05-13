package br.com.fiap.flexcheck.reservation.domain.entity;

import java.util.List;

public record ReservationEligibility(
        boolean eligible,
        List<String> reasons
) {
}
