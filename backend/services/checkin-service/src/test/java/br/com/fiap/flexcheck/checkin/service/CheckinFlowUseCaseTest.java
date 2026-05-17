package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutLookupCommand;
import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.command.IdentityDocumentVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.command.IdentitySelfieVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.command.IdentityVerificationConfirmCommand;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;
import br.com.fiap.flexcheck.checkin.service.result.GuestResult;
import br.com.fiap.flexcheck.checkin.service.result.KeyResult;
import br.com.fiap.flexcheck.checkin.service.result.PaymentResult;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.RoomResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;
import br.com.fiap.flexcheck.checkin.service.result.BiometryVerificationResult;
import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.FaceMatchProviderResult;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderClient;
import br.com.fiap.flexcheck.checkin.service.identity.OcrProviderResult;
import br.com.fiap.flexcheck.checkin.infrastructure.client.BiometryServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.AuditServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.KeyServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.NotificationServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PmsAdapterServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.PaymentServiceClient;
import br.com.fiap.flexcheck.checkin.infrastructure.client.ReservationServiceClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;

@ActiveProfiles("h2")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
public class CheckinFlowUseCaseTest {
    @Autowired
    private CreateSessionUseCase createSessionUseCase;
    @Autowired
    private AttachReservationUseCase attachReservationUseCase;
    @Autowired
    private ConfirmGuestUseCase confirmGuestUseCase;
    @Autowired
    private RegisterConsentsUseCase registerConsentsUseCase;
    @Autowired
    private CompleteCheckinUseCase completeCheckinUseCase;
    @Autowired
    private CheckoutLookupUseCase checkoutLookupUseCase;
    @Autowired
    private CheckoutUseCase checkoutUseCase;
    @Autowired
    private VerifyIdentityDocumentUseCase verifyIdentityDocumentUseCase;
    @Autowired
    private VerifyIdentitySelfieUseCase verifyIdentitySelfieUseCase;
    @Autowired
    private ConfirmIdentityVerificationUseCase confirmIdentityVerificationUseCase;
    @MockBean
    private ReservationServiceClient reservationServiceClient;
    @MockBean
    private PaymentServiceClient paymentServiceClient;
    @MockBean
    private KeyServiceClient keyServiceClient;
    @MockBean
    private AuditServiceClient auditServiceClient;
    @MockBean
    private BiometryServiceClient biometryServiceClient;
    @MockBean
    private PmsAdapterServiceClient pmsAdapterServiceClient;
    @MockBean
    private NotificationServiceClient notificationServiceClient;
    @MockBean
    private OcrProviderClient ocrProviderClient;
    @MockBean
    private FaceMatchProviderClient faceMatchProviderClient;

    @Test
    public void shouldCompleteCheckinAndCheckoutThroughUseCases() {
        ReservationResult reservationResult = new ReservationResult(
                1L,
                1L,
                "RSV-2026-0001",
                "CONFIRMED",
                "Flex Hotel Paulista",
                java.time.LocalDate.now(),
                java.time.LocalDate.now().plusDays(2),
                BigDecimal.valueOf(780.00),
                "BRL",
                true,
                List.of(),
                new GuestResult(1L, "Marcos Alberto", "CPF", "****8909", java.time.LocalDate.of(1995, 8, 15), "marcos@example.com", "+5511999999999"),
                new RoomResult(1L, "1204", "STANDARD", "AVAILABLE")
        );

        when(reservationServiceClient.search(anyLong(), anyString(), anyString())).thenReturn(reservationResult);
        when(reservationServiceClient.findById(1L)).thenReturn(reservationResult);
        doNothing().when(reservationServiceClient).confirmGuest(anyLong(), any());
        doNothing().when(auditServiceClient).record(any());
        when(paymentServiceClient.recordPayment(any(), any(), anyString(), anyString(), org.mockito.ArgumentMatchers.any(BigDecimal.class), any()))
                .thenReturn(new PaymentResult(1L, "PRE_AUTH", "APPROVED", BigDecimal.valueOf(780.00), "AUTH-1"));
        when(keyServiceClient.issueKey(anyLong(), anyLong(), anyString(), org.mockito.ArgumentMatchers.any(java.time.LocalDate.class)))
                .thenReturn(new KeyResult(1L, "DIGITAL", "ACTIVE", "KEY-1-1", java.time.LocalDateTime.now().plusDays(2)));
        doNothing().when(keyServiceClient).revokeKeys(anyLong());
        when(biometryServiceClient.recordVerification(anyLong(), anyLong(), anyString()))
                .thenReturn(new BiometryVerificationResult(
                        1L,
                        1L,
                        1L,
                        "APPROVED",
                        "MOCK",
                        "BIO-1",
                        BigDecimal.valueOf(98.5),
                        java.time.LocalDateTime.now()
                ));
        doNothing().when(pmsAdapterServiceClient).syncCheckin(anyLong(), anyLong(), anyLong(), anyString(), anyString(), any(BigDecimal.class));
        doNothing().when(pmsAdapterServiceClient).syncCheckout(anyLong(), anyLong(), anyLong(), any(BigDecimal.class));

        SessionResult session = createSessionUseCase.execute(new CreateSessionCommand(1L, "CHECKIN", "pt-BR"));
        SessionReservationResult reservation = attachReservationUseCase.execute(
                session.sessionId(),
                new AttachReservationCommand("RESERVATION_CODE", "RSV-2026-0001")
        );

        assertThat(reservation.reservation().eligible()).isTrue();

        confirmGuestUseCase.execute(session.sessionId(), new GuestConfirmationCommand(
                reservation.reservation().guest().id(),
                reservation.reservation().guest().fullName(),
                "CPF",
                "12345678909",
                reservation.reservation().guest().birthDate(),
                reservation.reservation().guest().email(),
                reservation.reservation().guest().phone()
        ));

        registerConsentsUseCase.execute(session.sessionId(), new ConsentCommand(List.of(
                new ConsentCommand.ConsentItemCommand("PRIVACY_POLICY", true, "2026.05"),
                new ConsentCommand.ConsentItemCommand("HOSTING_TERMS", true, "2026.05"),
                new ConsentCommand.ConsentItemCommand("BIOMETRY", false, "2026.05")
        )));

        CompleteCheckinResult checkin = completeCheckinUseCase.execute(session.sessionId(), new CompleteCheckinCommand(
                "TEST_CARD_APPROVED",
                "DIGITAL",
                "APPROVED",
                "SKIPPED"
        ));

        assertThat(checkin.status()).isEqualTo("CHECKED_IN");
        assertThat(checkin.key().value()).startsWith("KEY-");

        CheckoutPreviewResult checkoutPreview = checkoutLookupUseCase.execute(new CheckoutLookupCommand(
                1L,
                "1204",
                "CPF",
                "12345678909"
        ));

        assertThat(checkoutPreview.stayId()).isEqualTo(checkin.stayId());
        assertThat(checkoutPreview.charges()).isNotEmpty();

        CheckoutResult checkout = checkoutUseCase.execute(checkin.stayId(), new CheckoutCommand("TEST_CARD_APPROVED", true));

        assertThat(checkout.status()).isEqualTo("CHECKED_OUT");
        assertThat(checkout.receiptCode()).isEqualTo("RCP-" + checkin.stayId());
    }

    @Test
    public void shouldApproveIdentityVerificationWhenDocumentAndFaceMatch() {
        SessionResult session = createAttachedSession();
        when(ocrProviderClient.extract(anyString(), anyString()))
                .thenReturn(new OcrProviderResult("APPROVED", "OCR_TEST", "Marcos Alberto", "12345678909", "OCR-1", "ok"));
        when(faceMatchProviderClient.compare(anyString(), anyString(), anyString()))
                .thenReturn(new FaceMatchProviderResult("APPROVED", "FACE_TEST", BigDecimal.valueOf(97.4), "FACE-1", "ok"));
        doNothing().when(auditServiceClient).record(any());

        var document = verifyIdentityDocumentUseCase.execute(session.sessionId(), new IdentityDocumentVerificationCommand("document-image", "image/jpeg"));
        var selfie = verifyIdentitySelfieUseCase.execute(session.sessionId(), new IdentitySelfieVerificationCommand("selfie-image", "image/jpeg"));
        var confirmation = confirmIdentityVerificationUseCase.execute(session.sessionId(), new IdentityVerificationConfirmCommand(true, true));

        assertThat(document.documentStatus()).isEqualTo("APPROVED");
        assertThat(selfie.status()).isEqualTo("FACE_APPROVED");
        assertThat(confirmation.status()).isEqualTo("IDENTITY_CONFIRMED");
        assertThat(confirmation.canContinue()).isTrue();
    }

    @Test
    public void shouldRejectIdentityVerificationWhenDocumentDoesNotMatchReservation() {
        SessionResult session = createAttachedSession();
        when(ocrProviderClient.extract(anyString(), anyString()))
                .thenReturn(new OcrProviderResult("APPROVED", "OCR_TEST", "Different Guest", "00000000000", "OCR-2", "mismatch"));

        var document = verifyIdentityDocumentUseCase.execute(session.sessionId(), new IdentityDocumentVerificationCommand("document-image", "image/jpeg"));

        assertThat(document.documentStatus()).isEqualTo("REJECTED");
        assertThatThrownBy(() -> verifyIdentitySelfieUseCase.execute(session.sessionId(), new IdentitySelfieVerificationCommand("selfie-image", "image/jpeg")))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Document verification must be approved");
    }

    @Test
    public void shouldRejectIdentityVerificationWhenDocumentNameIsMissing() {
        SessionResult session = createAttachedSession();
        when(ocrProviderClient.extract(anyString(), anyString()))
                .thenReturn(new OcrProviderResult("APPROVED", "OCR_TEST", null, "12345678909", "OCR-4", "missing name"));

        var document = verifyIdentityDocumentUseCase.execute(session.sessionId(), new IdentityDocumentVerificationCommand("document-image", "image/jpeg"));

        assertThat(document.documentStatus()).isEqualTo("REJECTED");
        assertThat(document.canContinue()).isFalse();
    }

    @Test
    public void shouldRejectIdentityVerificationWhenFaceMatchIsRejected() {
        SessionResult session = createAttachedSession();
        when(ocrProviderClient.extract(anyString(), anyString()))
                .thenReturn(new OcrProviderResult("APPROVED", "OCR_TEST", "Marcos Alberto", "12345678909", "OCR-3", "ok"));
        when(faceMatchProviderClient.compare(anyString(), anyString(), anyString()))
                .thenReturn(new FaceMatchProviderResult("REJECTED", "FACE_TEST", BigDecimal.valueOf(42.1), "FACE-2", "low score"));

        verifyIdentityDocumentUseCase.execute(session.sessionId(), new IdentityDocumentVerificationCommand("document-image", "image/jpeg"));
        var selfie = verifyIdentitySelfieUseCase.execute(session.sessionId(), new IdentitySelfieVerificationCommand("selfie-image", "image/jpeg"));

        assertThat(selfie.status()).isEqualTo("FACE_REJECTED");
        assertThat(selfie.biometryStatus()).isEqualTo("REJECTED");
        assertThat(selfie.fallbackUsed()).isFalse();
        assertThat(selfie.canContinue()).isFalse();
    }

    @Test
    public void shouldUseDocumentOnlyFallbackWhenFaceMatchProviderIsUnavailable() {
        SessionResult session = createAttachedSession();
        when(ocrProviderClient.extract(anyString(), anyString()))
                .thenReturn(new OcrProviderResult("APPROVED", "OCR_TEST", "Marcos Alberto", "12345678909", "OCR-5", "ok"));
        when(faceMatchProviderClient.compare(anyString(), anyString(), anyString()))
                .thenReturn(new FaceMatchProviderResult("UNAVAILABLE", "FACE_TEST", null, "FACE-3", "unavailable"));

        verifyIdentityDocumentUseCase.execute(session.sessionId(), new IdentityDocumentVerificationCommand("document-image", "image/jpeg"));
        var selfie = verifyIdentitySelfieUseCase.execute(session.sessionId(), new IdentitySelfieVerificationCommand("selfie-image", "image/jpeg"));

        assertThat(selfie.status()).isEqualTo("DOCUMENT_ONLY_APPROVED");
        assertThat(selfie.biometryStatus()).isEqualTo("SKIPPED");
        assertThat(selfie.fallbackUsed()).isTrue();
        assertThat(selfie.canContinue()).isTrue();
    }

    private SessionResult createAttachedSession() {
        ReservationResult reservationResult = new ReservationResult(
                1L,
                1L,
                "RSV-2026-0001",
                "CONFIRMED",
                "Flex Hotel Paulista",
                java.time.LocalDate.now(),
                java.time.LocalDate.now().plusDays(2),
                BigDecimal.valueOf(780.00),
                "BRL",
                true,
                List.of(),
                new GuestResult(1L, "Marcos Alberto", "CPF", "****8909", java.time.LocalDate.of(1995, 8, 15), "marcos@example.com", "+5511999999999"),
                new RoomResult(1L, "1204", "STANDARD", "AVAILABLE")
        );
        when(reservationServiceClient.search(anyLong(), anyString(), anyString())).thenReturn(reservationResult);
        when(reservationServiceClient.findById(1L)).thenReturn(reservationResult);

        SessionResult session = createSessionUseCase.execute(new CreateSessionCommand(1L, "CHECKIN", "pt-BR"));
        attachReservationUseCase.execute(session.sessionId(), new AttachReservationCommand("RESERVATION_CODE", "RSV-2026-0001"));
        return session;
    }
}
