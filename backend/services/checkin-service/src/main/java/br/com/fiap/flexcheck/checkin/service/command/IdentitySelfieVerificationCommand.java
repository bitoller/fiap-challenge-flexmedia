package br.com.fiap.flexcheck.checkin.service.command;

public record IdentitySelfieVerificationCommand(
        String imageBase64,
        String mimeType
) {
}
