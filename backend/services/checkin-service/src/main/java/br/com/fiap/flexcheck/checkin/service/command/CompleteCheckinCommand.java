package br.com.fiap.flexcheck.checkin.service.command;

public record CompleteCheckinCommand(
        String paymentMethod,
        String keyType,
        String documentStatus,
        String biometryStatus
) {
}

