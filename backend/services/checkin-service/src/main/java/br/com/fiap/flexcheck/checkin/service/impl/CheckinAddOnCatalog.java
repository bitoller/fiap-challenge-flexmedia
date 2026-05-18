package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.service.result.CheckinAddOnOfferResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Set;

@Component
class CheckinAddOnCatalog {
    private static final BigDecimal BREAKFAST_AMOUNT = new BigDecimal("145.00");
    private static final BigDecimal ROOM_UPGRADE_AMOUNT = new BigDecimal("480.00");
    private static final BigDecimal LATE_CHECKOUT_AMOUNT = new BigDecimal("220.00");

    List<CheckinAddOnOfferResult> listFor(ReservationResult reservation, Set<String> selectedCodes) {
        int nights = nights(reservation);
        String currency = reservation.currency() == null || reservation.currency().isBlank() ? "BRL" : reservation.currency();

        return List.of(
                offer("BREAKFAST", "PER_PERSON", BREAKFAST_AMOUNT, 1, currency, selectedCodes),
                offer("ROOM_UPGRADE", "PER_NIGHT", ROOM_UPGRADE_AMOUNT, nights, currency, selectedCodes),
                offer("LATE_CHECKOUT", "ONE_TIME", LATE_CHECKOUT_AMOUNT, 1, currency, selectedCodes)
        );
    }

    private CheckinAddOnOfferResult offer(
            String code,
            String pricingType,
            BigDecimal unitAmount,
            int quantity,
            String currency,
            Set<String> selectedCodes
    ) {
        return new CheckinAddOnOfferResult(
                code,
                pricingType,
                unitAmount,
                quantity,
                unitAmount.multiply(BigDecimal.valueOf(quantity)),
                currency,
                selectedCodes.contains(code)
        );
    }

    private int nights(ReservationResult reservation) {
        if (reservation.arrivalDate() == null || reservation.departureDate() == null) {
            return 1;
        }

        long nights = ChronoUnit.DAYS.between(reservation.arrivalDate(), reservation.departureDate());
        return (int) Math.max(1, nights);
    }
}
