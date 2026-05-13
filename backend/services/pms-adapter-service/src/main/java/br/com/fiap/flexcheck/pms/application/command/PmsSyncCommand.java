package br.com.fiap.flexcheck.pms.application.command;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record PmsSyncCommand(
        @NotNull Long reservationId,
        String status,
        Map<String, Object> payload
) {
    public PmsEventCommand toEventCommand(String eventType) {
        return new PmsEventCommand(reservationId, eventType, status, payload);
    }
}
