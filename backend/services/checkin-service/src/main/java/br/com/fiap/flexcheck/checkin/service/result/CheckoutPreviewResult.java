package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;
import java.util.List;

public record CheckoutPreviewResult(
        Long stayId,
        String stayStatus,
        BigDecimal totalDue,
        ReservationResult reservation,
        List<CheckoutChargeResult> charges
) {
}
