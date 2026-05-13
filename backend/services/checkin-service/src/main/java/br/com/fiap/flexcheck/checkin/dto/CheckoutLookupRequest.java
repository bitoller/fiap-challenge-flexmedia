package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutLookupRequest(
        @NotNull Long hotelId,
        @NotBlank String roomNumber,
        @NotBlank String documentType,
        @NotBlank String documentNumber
) {
}
