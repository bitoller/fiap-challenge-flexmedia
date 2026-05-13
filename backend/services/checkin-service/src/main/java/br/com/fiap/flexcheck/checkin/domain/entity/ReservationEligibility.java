package br.com.fiap.flexcheck.checkin.domain.entity;

import java.util.List;

public record ReservationEligibility(
        boolean eligible,
        List<String> reasons
) {
}

