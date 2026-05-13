package br.com.fiap.flexcheck.pms.application.command;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record PmsEventCommand(
        @NotNull Long reservationId,
        @NotBlank String eventType,
        String status,
        Map<String, Object> payload
) {
}
