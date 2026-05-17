package br.com.fiap.flexcheck.checkin.service.identity;

public record OcrProviderResult(
        String status,
        String provider,
        String fullName,
        String documentNumber,
        String referenceCode,
        String message
) {
}
