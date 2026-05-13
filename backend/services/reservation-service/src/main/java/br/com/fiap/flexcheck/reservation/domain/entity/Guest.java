package br.com.fiap.flexcheck.reservation.domain.entity;

import java.time.LocalDate;

public record Guest(
        Long id,
        String fullName,
        String documentType,
        String documentNumber,
        LocalDate birthDate,
        String email,
        String phone
) {
}
