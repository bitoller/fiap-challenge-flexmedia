package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ReservationResponse(
        Long id,
        String code,
        String status,
        String hotelName,
        LocalDate arrivalDate,
        LocalDate departureDate,
        BigDecimal totalAmount,
        String currency,
        boolean eligible,
        List<String> eligibilityReasons,
        GuestResponse guest,
        RoomResponse room
) {
}
