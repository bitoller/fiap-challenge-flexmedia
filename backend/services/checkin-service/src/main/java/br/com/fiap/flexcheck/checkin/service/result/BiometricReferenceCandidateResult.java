package br.com.fiap.flexcheck.checkin.service.result;

public record BiometricReferenceCandidateResult(
        Long stayId,
        Long reservationId,
        Long guestId,
        String imageBase64,
        String mimeType
) {
}
