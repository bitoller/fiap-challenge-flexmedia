package br.com.fiap.flexcheck.checkin.dto;

public record RoomResponse(
        Long id,
        String number,
        String type,
        String status
) {
}
