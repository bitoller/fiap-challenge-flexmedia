package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.checkin.domain.entity.KeyCredential;
import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.checkin.domain.entity.SessionContext;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.checkin.mapper.ResultMapper;
import br.com.fiap.flexcheck.checkin.repository.AuditRepository;
import br.com.fiap.flexcheck.checkin.repository.KeyRepository;
import br.com.fiap.flexcheck.checkin.repository.PaymentRepository;
import br.com.fiap.flexcheck.checkin.repository.SessionRepository;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.repository.VerificationRepository;
import br.com.fiap.flexcheck.checkin.service.CompleteCheckinUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class DefaultCompleteCheckinUseCase implements CompleteCheckinUseCase {
    private final SessionRepository sessionRepository;
    private final VerificationRepository verificationRepository;
    private final PaymentRepository paymentRepository;
    private final StayRepository stayRepository;
    private final KeyRepository keyRepository;
    private final AuditRepository auditRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultCompleteCheckinUseCase(
            SessionRepository sessionRepository,
            VerificationRepository verificationRepository,
            PaymentRepository paymentRepository,
            StayRepository stayRepository,
            KeyRepository keyRepository,
            AuditRepository auditRepository,
            ReservationEligibilityPolicy eligibilityPolicy
    ) {
        this.sessionRepository = sessionRepository;
        this.verificationRepository = verificationRepository;
        this.paymentRepository = paymentRepository;
        this.stayRepository = stayRepository;
        this.keyRepository = keyRepository;
        this.auditRepository = auditRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    @Transactional
    public CompleteCheckinResult execute(Long sessionId, CompleteCheckinCommand command) {
        SessionContext context = sessionRepository.findSessionContext(sessionId)
                .orElseThrow(() -> new BusinessException("SESSION_NOT_FOUND", "Sessao nao encontrada.", 404));

        Reservation reservation = context.reservation();
        ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
        if (!eligibility.eligible()) {
            throw new BusinessException(
                    "RESERVATION_NOT_ELIGIBLE",
                    "Essa reserva nao pode concluir check-in automaticamente.",
                    409,
                    Map.of("reasons", eligibility.reasons())
            );
        }

        String documentStatus = defaultValue(command.documentStatus(), "APPROVED").toUpperCase();
        if ("REJECTED".equals(documentStatus)) {
            verificationRepository.insertDocumentVerification(sessionId, reservation.guest().id(), "REJECTED");
            sessionRepository.failSession(sessionId, "DOCUMENT_REJECTED");
            throw new BusinessException("DOCUMENT_REJECTED", "Documento rejeitado. Procure a recepcao.", 409);
        }

        verificationRepository.insertDocumentVerification(sessionId, reservation.guest().id(), documentStatus);
        verificationRepository.insertBiometryVerification(sessionId, reservation.guest().id(), defaultValue(command.biometryStatus(), "SKIPPED").toUpperCase());

        if ("TEST_CARD_DECLINED".equalsIgnoreCase(command.paymentMethod())) {
            paymentRepository.insertPayment(null, reservation.id(), "PRE_AUTH", "DECLINED", reservation.totalAmount(), null);
            sessionRepository.failSession(sessionId, "PAYMENT_DECLINED");
            throw new BusinessException("PAYMENT_DECLINED", "Pagamento recusado. Tente outro cartao ou procure a recepcao.", 409);
        }

        paymentRepository.insertPayment(null, reservation.id(), "PRE_AUTH", "APPROVED", reservation.totalAmount(), "AUTH-" + sessionId);
        Long stayId = stayRepository.createStay(reservation);
        KeyCredential key = keyRepository.createKey(stayId, reservation.room().id(), command.keyType(), reservation.departureDate());
        stayRepository.markCheckedIn(sessionId, reservation.id(), reservation.room().id());
        auditRepository.record(new AuditEvent("KIOSK", null, "CHECKIN_COMPLETED", "STAY", String.valueOf(stayId), "SUCCESS", context.correlationId()));

        return new CompleteCheckinResult(
                sessionId,
                "CHECKED_IN",
                stayId,
                reservation.room().number(),
                reservation.totalAmount(),
                ResultMapper.toKeyResult(key)
        );
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
