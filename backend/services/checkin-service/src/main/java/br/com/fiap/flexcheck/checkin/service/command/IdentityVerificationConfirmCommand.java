package br.com.fiap.flexcheck.checkin.service.command;

public record IdentityVerificationConfirmCommand(
        boolean termsAccepted,
        boolean biometricConsentAccepted
) {
}
