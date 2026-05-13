package br.com.fiap.flexcheck.checkin.service.result;

public record RoomResult(
        Long id,
        String number,
        String type,
        String status
) {
}

