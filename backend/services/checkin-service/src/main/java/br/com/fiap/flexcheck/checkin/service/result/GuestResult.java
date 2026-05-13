package br.com.fiap.flexcheck.checkin.service.result;

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

