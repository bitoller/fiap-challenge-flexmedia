package br.com.fiap.flexcheck.checkin.domain.entity;

import java.math.BigDecimal;

public record Stay(
        Long id,
        Long reservationId,
        Long roomId,
        String status,
        BigDecimal totalAmount
) {
    public boolean isActiveForCheckout() {
        return "ACTIVE".equalsIgnoreCase(status) || "PENDING_KEY".equalsIgnoreCase(status);
    }
}

