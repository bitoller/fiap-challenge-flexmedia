package br.com.fiap.flexcheck.checkin.dto;

import java.time.LocalDate;

public record GuestResponse(
        Long id,
        String fullName,
        String documentType,
        String maskedDocument,
        LocalDate birthDate,
        String email,
        String phone
) {
}
