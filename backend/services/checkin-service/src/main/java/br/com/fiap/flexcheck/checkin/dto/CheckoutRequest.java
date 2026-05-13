package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
        @NotBlank String paymentMethod,
        boolean confirmCharges
) {
}
