package br.com.fiap.flexcheck.reservation.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

public record Reservation(
        Long id,
        Long hotelId,
        Long kioskId,
        String code,
        String status,
        String hotelName,
        LocalDate arrivalDate,
        LocalDate departureDate,
        BigDecimal totalAmount,
        String currency,
        Guest guest,
        Room room
) {
}
