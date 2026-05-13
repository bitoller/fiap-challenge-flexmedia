package br.com.fiap.flexcheck.checkin.service.command;

public record CreateSessionCommand(
        Long kioskId,
        String flowType,
        String language
) {
}

