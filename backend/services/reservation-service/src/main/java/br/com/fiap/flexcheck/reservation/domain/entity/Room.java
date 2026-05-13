package br.com.fiap.flexcheck.reservation.domain.entity;

public record Room(
        Long id,
        String number,
        String type,
        String status
) {
}
