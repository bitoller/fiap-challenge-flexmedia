package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import br.com.fiap.flexcheck.checkin.service.VerifyIdentitySelfieUseCase;
import br.com.fiap.flexcheck.checkin.service.command.IdentitySelfieVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderResult;
import br.com.fiap.flexcheck.checkin.service.identity.IdentityDocumentImageStore;
import br.com.fiap.flexcheck.checkin.service.identity.IdentityVerificationProperties;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultVerifyIdentitySelfieUseCase implements VerifyIdentitySelfieUseCase {
    private final SessionRepository sessionRepository;
    private final VerificationRepository verificationRepository;
    private final FaceMatchProviderClient faceMatchProviderClient;
    private final IdentityDocumentImageStore imageStore;
    private final IdentityVerificationProperties properties;

    public DefaultVerifyIdentitySelfieUseCase(
            SessionRepository sessionRepository,
            VerificationRepository verificationRepository,
            FaceMatchProviderClient faceMatchProviderClient,
            IdentityDocumentImageStore imageStore,
            IdentityVerificationProperties properties
    ) {
        this.sessionRepository = sessionRepository;
        this.verificationRepository = verificationRepository;
        this.faceMatchProviderClient = faceMatchProviderClient;
        this.imageStore = imageStore;
        this.properties = properties;
    }

    @Override
    @Transactional
    public IdentityVerificationResult execute(Long sessionId, IdentitySelfieVerificationCommand command) {
        var context = sessionRepository.findSessionContext(sessionId)
                .orElseThrow(() -> new BusinessException("SESSION_NOT_FOUND", "Session not found.", 404));
        String documentStatus = verificationRepository.findLatestDocumentStatus(sessionId).orElse("");
        if (!"APPROVED".equalsIgnoreCase(documentStatus)) {
            throw new BusinessException("DOCUMENT_NOT_APPROVED", "Document verification must be approved before selfie verification.", 409);
        }

        String documentImage = imageStore.get(sessionId).orElse(command.imageBase64());
        FaceMatchProviderResult faceMatch = faceMatchProviderClient.compare(documentImage, command.imageBase64(), command.mimeType());
        boolean approved = "APPROVED".equalsIgnoreCase(faceMatch.status());
        boolean fallback = "UNAVAILABLE".equalsIgnoreCase(faceMatch.status()) && properties.documentOnlyFallbackEnabled();
        String status = approved ? "APPROVED" : fallback ? "SKIPPED" : "REJECTED";
        String provider = fallback ? "DOCUMENT_ONLY" : faceMatch.provider();
        String reference = faceMatch.referenceCode() == null || faceMatch.referenceCode().isBlank() ? "BIO-" + sessionId : faceMatch.referenceCode();
        verificationRepository.insertBiometryVerification(sessionId, context.reservation().guest().id(), status, provider, reference, faceMatch.score());

        return new IdentityVerificationResult(
                sessionId,
                approved ? "FACE_APPROVED" : fallback ? "DOCUMENT_ONLY_APPROVED" : "FACE_REJECTED",
                documentStatus,
                status,
                provider,
                faceMatch.score(),
                approved || fallback,
                fallback,
                approved ? "Face verified." : fallback ? "Document-only fallback approved." : "Face could not be verified."
        );
    }
}
