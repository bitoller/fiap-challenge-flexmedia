package br.com.fiap.flexcheck.checkin.domain.entity;

public record Room(
        Long id,
        String number,
        String type,
        String status
) {
}

