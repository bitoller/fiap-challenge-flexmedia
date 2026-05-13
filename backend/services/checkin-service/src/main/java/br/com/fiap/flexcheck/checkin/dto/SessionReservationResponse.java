package br.com.fiap.flexcheck.checkin.dto;

public record SessionReservationResponse(
        Long sessionId,
        String status,
        ReservationResponse reservation
) {
}
