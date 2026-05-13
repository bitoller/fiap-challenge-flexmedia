package br.com.fiap.flexcheck.reservation.service.result;

public record RoomResult(
        Long id,
        String number,
        String type,
        String status
) {
}
