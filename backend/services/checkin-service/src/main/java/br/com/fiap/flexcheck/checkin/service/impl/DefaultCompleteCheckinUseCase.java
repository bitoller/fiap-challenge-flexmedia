package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.infrastructure.client.BiometryServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.KeyServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PmsAdapterServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PaymentServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import br.com.fiap.flexcheck.checkin.service.result.BiometryVerificationResult;
import br.com.fiap.flexcheck.checkin.service.CompleteCheckinUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DefaultCompleteCheckinUseCase implements CompleteCheckinUseCase {
    private final SessionRepository sessionRepository;
    private final VerificationRepository verificationRepository;
    private final BiometryServiceClient biometryServiceClient;
    private final PaymentServiceClient paymentServiceClient;
    private final StayRepository stayRepository;
    private final KeyServiceClient keyServiceClient;
    private final PmsAdapterServiceClient pmsAdapterServiceClient;
    private final AuditServiceClient auditServiceClient;
    private final ReservationServiceClient reservationServiceClient;

    public DefaultCompleteCheckinUseCase(
            SessionRepository sessionRepository,
            VerificationRepository verificationRepository,
            BiometryServiceClient biometryServiceClient,
            PaymentServiceClient paymentServiceClient,
            StayRepository stayRepository,
            KeyServiceClient keyServiceClient,
            PmsAdapterServiceClient pmsAdapterServiceClient,
            AuditServiceClient auditServiceClient,
            ReservationServiceClient reservationServiceClient
    ) {
        this.sessionRepository = sessionRepository;
        this.verificationRepository = verificationRepository;
        this.biometryServiceClient = biometryServiceClient;
        this.paymentServiceClient = paymentServiceClient;
        this.stayRepository = stayRepository;
        this.keyServiceClient = keyServiceClient;
        this.pmsAdapterServiceClient = pmsAdapterServiceClient;
        this.auditServiceClient = auditServiceClient;
        this.reservationServiceClient = reservationServiceClient;
    }

    @Override
    @Transactional
    public CompleteCheckinResult execute(Long sessionId, CompleteCheckinCommand command) {
        Long reservationId = sessionRepository.findReservationIdBySession(sessionId);
        var reservation = reservationServiceClient.findById(reservationId);
        if (!reservation.eligible()) {
            throw new BusinessException(
                    "RESERVATION_NOT_ELIGIBLE",
                    "Essa reserva nao pode concluir check-in automaticamente.",
                    409
            );
        }

        String documentStatus = defaultValue(command.documentStatus(), "APPROVED").toUpperCase();
        if ("REJECTED".equals(documentStatus)) {
            verificationRepository.insertDocumentVerification(sessionId, reservation.guest().id(), "REJECTED");
            sessionRepository.failSession(sessionId, "DOCUMENT_REJECTED");
            throw new BusinessException("DOCUMENT_REJECTED", "Documento rejeitado. Procure a recepcao.", 409);
        }

        verificationRepository.insertDocumentVerification(sessionId, reservation.guest().id(), documentStatus);
        String biometryStatus = defaultValue(command.biometryStatus(), "SKIPPED").toUpperCase();
        BiometryVerificationResult biometryVerification = biometryServiceClient.recordVerification(
                sessionId,
                reservation.guest().id(),
                biometryStatus
        );
        if ("REJECTED".equalsIgnoreCase(biometryVerification.status())) {
            sessionRepository.failSession(sessionId, "BIOMETRY_REJECTED");
            throw new BusinessException("BIOMETRY_REJECTED", "Biometria rejeitada. Procure a recepcao.", 409);
        }

        if ("TEST_CARD_DECLINED".equalsIgnoreCase(command.paymentMethod())) {
            paymentServiceClient.recordPayment(null, reservation.id(), "PRE_AUTH", "DECLINED", reservation.totalAmount(), null);
            sessionRepository.failSession(sessionId, "PAYMENT_DECLINED");
            throw new BusinessException("PAYMENT_DECLINED", "Pagamento recusado. Tente outro cartao ou procure a recepcao.", 409);
        }

        paymentServiceClient.recordPayment(null, reservation.id(), "PRE_AUTH", "APPROVED", reservation.totalAmount(), "AUTH-" + sessionId);
        Long stayId = stayRepository.createStay(reservation.id(), reservation.room().id(), reservation.departureDate(), reservation.totalAmount());
        var key = keyServiceClient.issueKey(stayId, reservation.room().id(), command.keyType(), reservation.departureDate());
        stayRepository.markCheckedIn(sessionId, reservation.id(), reservation.room().id());
        pmsAdapterServiceClient.syncCheckin(
                reservation.id(),
                stayId,
                reservation.room().id(),
                reservation.room().number(),
                reservation.guest().fullName(),
                reservation.totalAmount()
        );
        auditServiceClient.record(new br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent("KIOSK", null, "CHECKIN_COMPLETED", "STAY", String.valueOf(stayId), "SUCCESS", null));

        return new CompleteCheckinResult(
                sessionId,
                "CHECKED_IN",
                stayId,
                reservation.room().number(),
                reservation.totalAmount(),
                key
        );
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
