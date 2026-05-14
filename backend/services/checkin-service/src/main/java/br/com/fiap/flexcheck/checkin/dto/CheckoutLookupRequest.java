package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotNull;

public record CheckoutLookupRequest(
        @NotNull Long hotelId,
        String roomNumber,
        String documentType,
        String documentNumber
) {
}
