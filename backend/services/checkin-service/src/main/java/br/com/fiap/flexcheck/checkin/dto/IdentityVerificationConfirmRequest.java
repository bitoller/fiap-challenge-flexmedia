package br.com.fiap.flexcheck.checkin.dto;

public record IdentityVerificationConfirmRequest(
        boolean termsAccepted,
        boolean biometricConsentAccepted
) {
}
