package br.com.fiap.flexcheck.checkin.service.command;

public record CheckoutCommand(
        String paymentMethod,
        boolean confirmCharges
) {
}

