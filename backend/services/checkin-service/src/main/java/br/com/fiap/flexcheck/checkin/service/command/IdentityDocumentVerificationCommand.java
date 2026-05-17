package br.com.fiap.flexcheck.checkin.service.command;

public record IdentityDocumentVerificationCommand(
        String imageBase64,
        String mimeType
) {
}
