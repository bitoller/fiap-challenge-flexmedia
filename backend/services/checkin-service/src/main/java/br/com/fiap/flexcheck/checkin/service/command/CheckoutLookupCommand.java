package br.com.fiap.flexcheck.checkin.service.command;

public record CheckoutLookupCommand(
        Long hotelId,
        String roomNumber,
        String documentType,
        String documentNumber,
        String faceImageBase64,
        String faceMimeType
) {
}
