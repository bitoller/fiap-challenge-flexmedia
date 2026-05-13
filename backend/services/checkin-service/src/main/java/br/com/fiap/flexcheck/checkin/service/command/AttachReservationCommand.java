package br.com.fiap.flexcheck.checkin.service.command;

public record AttachReservationCommand(
        String searchType,
        String searchValue
) {
}

