package br.com.fiap.flexcheck.key.application.command;

import java.time.LocalDate;

public record IssueKeyCommand(
        Long stayId,
        Long roomId,
        String keyType,
        LocalDate departureDate
) {
}
