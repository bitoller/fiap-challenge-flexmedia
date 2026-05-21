package br.com.fiap.flexcheck.checkin.domain.entity;

import java.math.BigDecimal;

public record Stay(
        Long id,
        Long reservationId,
        Long hotelId,
        Long roomId,
        String status,
        BigDecimal checkoutDue,
        String guestEmail
) {
    public boolean isActiveForCheckout() {
        return "ACTIVE".equalsIgnoreCase(status) || "PENDING_KEY".equalsIgnoreCase(status);
    }
}

