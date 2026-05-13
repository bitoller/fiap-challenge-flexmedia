package br.com.fiap.flexcheck.reservation.application.command;

import java.time.LocalDate;

public record GuestConfirmationCommand(
        Long guestId,
        String fullName,
        String documentType,
        String documentNumber,
        LocalDate birthDate,
        String email,
        String phone
) {
}
