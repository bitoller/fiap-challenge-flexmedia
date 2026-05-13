package br.com.fiap.flexcheck.checkin.domain.entity;

public record SessionContext(
        Long sessionId,
        String status,
        String correlationId,
        Reservation reservation
) {
}

