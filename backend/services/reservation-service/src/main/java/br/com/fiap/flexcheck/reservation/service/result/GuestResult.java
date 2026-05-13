package br.com.fiap.flexcheck.reservation.service.result;

import java.time.LocalDate;

public record GuestResult(
        Long id,
        String fullName,
        String documentType,
        String maskedDocument,
        LocalDate birthDate,
        String email,
        String phone
) {
}
