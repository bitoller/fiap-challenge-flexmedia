package br.com.fiap.flexcheck.checkin.service.result;

public record SessionReservationResult(
        Long sessionId,
        String status,
        ReservationResult reservation
) {
}

