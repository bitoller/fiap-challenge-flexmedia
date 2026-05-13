package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.AttachReservationCommand;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.command.CompleteCheckinCommand;
import br.com.fiap.flexcheck.checkin.service.command.ConsentCommand;
import br.com.fiap.flexcheck.checkin.service.command.CreateSessionCommand;
import br.com.fiap.flexcheck.checkin.service.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;
import br.com.fiap.flexcheck.checkin.service.result.CompleteCheckinResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionReservationResult;
import br.com.fiap.flexcheck.checkin.service.result.SessionResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("h2")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@TestExecutionListeners(
        listeners = DependencyInjectionTestExecutionListener.class,
        mergeMode = TestExecutionListeners.MergeMode.REPLACE_DEFAULTS
)
class CheckinFlowUseCaseTest {
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
    private CheckoutUseCase checkoutUseCase;

    @Test
    void shouldCompleteCheckinAndCheckoutThroughUseCases() {
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

        CheckoutResult checkout = checkoutUseCase.execute(checkin.stayId(), new CheckoutCommand("TEST_CARD_APPROVED", true));

        assertThat(checkout.status()).isEqualTo("CHECKED_OUT");
        assertThat(checkout.receiptCode()).isEqualTo("RCP-" + checkin.stayId());
    }
}
