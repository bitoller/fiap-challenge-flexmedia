package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.repository.ConsentRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import br.com.fiap.flexcheck.checkin.service.ConfirmIdentityVerificationUseCase;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import br.com.fiap.flexcheck.checkin.service.command.IdentityVerificationConfirmCommand;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DefaultConfirmIdentityVerificationUseCase implements ConfirmIdentityVerificationUseCase {
    private final SessionRepository sessionRepository;
    private final VerificationRepository verificationRepository;
    private final ConsentRepository consentRepository;
    private final AuditServiceClient auditServiceClient;

    public DefaultConfirmIdentityVerificationUseCase(
            SessionRepository sessionRepository,
            VerificationRepository verificationRepository,
            ConsentRepository consentRepository,
            AuditServiceClient auditServiceClient
    ) {
        this.sessionRepository = sessionRepository;
        this.verificationRepository = verificationRepository;
        this.consentRepository = consentRepository;
        this.auditServiceClient = auditServiceClient;
    }

    @Override
    @Transactional
    public IdentityVerificationResult execute(Long sessionId, IdentityVerificationConfirmCommand command) {
        var context = sessionRepository.findSessionContext(sessionId)
                .orElseThrow(() -> new BusinessException("SESSION_NOT_FOUND", "Session not found.", 404));
        String documentStatus = verificationRepository.findLatestDocumentStatus(sessionId).orElse("");
        String biometryStatus = verificationRepository.findLatestBiometryStatus(sessionId).orElse("");

        if (!command.termsAccepted() || !command.biometricConsentAccepted()) {
            throw new BusinessException("CONSENT_REQUIRED", "Terms and biometric consent are required.", 400);
        }
        if (!"APPROVED".equalsIgnoreCase(documentStatus)) {
            throw new BusinessException("DOCUMENT_REJECTED", "Document verification is not approved.", 409);
        }
        if (!"APPROVED".equalsIgnoreCase(biometryStatus) && !"SKIPPED".equalsIgnoreCase(biometryStatus)) {
            throw new BusinessException("BIOMETRY_REJECTED", "Biometric verification is not approved.", 409);
        }

        Long guestId = context.reservation().guest().id();
        List<ConsentCommand.ConsentItemCommand> consents = List.of(
                new ConsentCommand.ConsentItemCommand("PRIVACY_POLICY", true, "2026.05"),
                new ConsentCommand.ConsentItemCommand("HOSTING_TERMS", true, "2026.05"),
                new ConsentCommand.ConsentItemCommand("BIOMETRY", true, "2026.05")
        );
        consents.forEach(item -> consentRepository.saveConsent(sessionId, guestId, item));
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent(context.reservation().hotelId(), "KIOSK", null, "IDENTITY_VERIFIED", "CHECKIN_SESSION", String.valueOf(sessionId), "SUCCESS", null));

        return new IdentityVerificationResult(
                sessionId,
                "IDENTITY_CONFIRMED",
                documentStatus,
                biometryStatus,
                "KIOSK",
                null,
                true,
                "SKIPPED".equalsIgnoreCase(biometryStatus),
                "Identity verification confirmed."
        );
    }
}
