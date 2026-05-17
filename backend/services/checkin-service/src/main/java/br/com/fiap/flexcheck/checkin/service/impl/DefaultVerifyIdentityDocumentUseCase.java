package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import br.com.fiap.flexcheck.checkin.service.VerifyIdentityDocumentUseCase;
import br.com.fiap.flexcheck.checkin.service.command.IdentityDocumentVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.identity.IdentityDocumentImageStore;
import br.com.fiap.flexcheck.checkin.service.identity.IdentityVerificationProperties;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderResult;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;

@Service
public class DefaultVerifyIdentityDocumentUseCase implements VerifyIdentityDocumentUseCase {
    private final SessionRepository sessionRepository;
    private final VerificationRepository verificationRepository;
    private final OcrProviderClient ocrProviderClient;
    private final IdentityDocumentImageStore imageStore;
    private final IdentityVerificationProperties properties;

    public DefaultVerifyIdentityDocumentUseCase(
            SessionRepository sessionRepository,
            VerificationRepository verificationRepository,
            OcrProviderClient ocrProviderClient,
            IdentityDocumentImageStore imageStore,
            IdentityVerificationProperties properties
    ) {
        this.sessionRepository = sessionRepository;
        this.verificationRepository = verificationRepository;
        this.ocrProviderClient = ocrProviderClient;
        this.imageStore = imageStore;
        this.properties = properties;
    }

    @Override
    @Transactional
    public IdentityVerificationResult execute(Long sessionId, IdentityDocumentVerificationCommand command) {
        var context = sessionRepository.findSessionContext(sessionId)
                .orElseThrow(() -> new BusinessException("SESSION_NOT_FOUND", "Session not found.", 404));
        Reservation reservation = context.reservation();
        OcrProviderResult ocr = ocrProviderClient.extract(command.imageBase64(), command.mimeType());
        boolean providerUnavailable = "UNAVAILABLE".equalsIgnoreCase(ocr.status());
        boolean approved = providerUnavailable && properties.demoAutoApprove();

        if (!approved && !providerUnavailable) {
            approved = documentMatchesReservation(ocr, reservation);
        }

        String status = approved ? "APPROVED" : providerUnavailable ? "MANUAL_REVIEW" : "REJECTED";
        String reference = ocr.referenceCode() == null || ocr.referenceCode().isBlank() ? "DOC-" + sessionId : ocr.referenceCode();
        verificationRepository.insertDocumentVerification(sessionId, reservation.guest().id(), status, ocr.provider(), reference);

        if (approved) {
            imageStore.put(sessionId, command.imageBase64());
        }

        return new IdentityVerificationResult(
                sessionId,
                approved ? "DOCUMENT_APPROVED" : providerUnavailable ? "PROVIDER_UNAVAILABLE" : "DOCUMENT_REJECTED",
                status,
                verificationRepository.findLatestBiometryStatus(sessionId).orElse(null),
                ocr.provider(),
                null,
                false,
                false,
                approved ? "Document verified." : "Document could not be verified."
        );
    }

    private boolean documentMatchesReservation(OcrProviderResult ocr, Reservation reservation) {
        String expectedDocument = digits(reservation.guest().documentNumber());
        String actualDocument = digits(ocr.documentNumber());
        if (expectedDocument.isBlank() || !expectedDocument.equals(actualDocument)) {
            return false;
        }

        String expectedName = normalizeName(reservation.guest().fullName());
        String actualName = normalizeName(ocr.fullName());
        return !actualName.isBlank() && (expectedName.contains(actualName) || actualName.contains(expectedName));
    }

    private String digits(String value) {
        return value == null ? "" : value.replaceAll("\\D", "");
    }

    private String normalizeName(String value) {
        if (value == null) {
            return "";
        }
        return Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replaceAll("[^A-Za-z ]", " ")
                .replaceAll("\\s+", " ")
                .trim()
                .toUpperCase();
    }
}
