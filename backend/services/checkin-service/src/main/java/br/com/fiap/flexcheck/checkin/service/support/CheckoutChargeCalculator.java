package br.com.fiap.flexcheck.checkin.service.support;

import br.com.fiap.flexcheck.checkin.service.result.CheckoutChargeResult;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class CheckoutChargeCalculator {
    private static final BigDecimal LATE_CHECKOUT_AMOUNT = new BigDecimal("120.00");

    private CheckoutChargeCalculator() {
    }

    public static BigDecimal calculateDue(Timestamp expectedCheckoutAt) {
        if (expectedCheckoutAt == null) {
            return BigDecimal.ZERO;
        }

        LocalDateTime expectedCheckout = expectedCheckoutAt.toLocalDateTime();
        if (LocalDateTime.now().isAfter(expectedCheckout)) {
            return LATE_CHECKOUT_AMOUNT;
        }

        return BigDecimal.ZERO;
    }

    public static List<CheckoutChargeResult> buildCharges(Timestamp expectedCheckoutAt) {
        BigDecimal lateCheckout = calculateDue(expectedCheckoutAt);
        List<CheckoutChargeResult> charges = new ArrayList<>();

        if (lateCheckout.compareTo(BigDecimal.ZERO) > 0) {
            charges.add(new CheckoutChargeResult(
                    "LATE_CHECKOUT",
                    "Late checkout adjustment",
                    lateCheckout
            ));
        }

        return List.copyOf(charges);
    }
}
