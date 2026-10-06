package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.RecordAuditUseCase;
import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.admin.domain.entity.GuestServiceType;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class DefaultRequestGuestServiceUseCaseTest {

    @Test
    void shouldRecordTypedGuestServiceRequestInAudit() {
        RecordAuditUseCase recordAuditUseCase = mock(RecordAuditUseCase.class);
        DefaultRequestGuestServiceUseCase useCase = new DefaultRequestGuestServiceUseCase(recordAuditUseCase);

        useCase.execute(new GuestServiceRequestCommand(
                1L,
                "kiosk-7",
                GuestServiceType.HOUSEKEEPING,
                "/services",
                "correlation-123"
        ));

        ArgumentCaptor<AuditEvent> eventCaptor = ArgumentCaptor.forClass(AuditEvent.class);
        verify(recordAuditUseCase).execute(eventCaptor.capture());

        AuditEvent event = eventCaptor.getValue();
        assertThat(event.hotelId()).isEqualTo(1L);
        assertThat(event.actorType()).isEqualTo("KIOSK");
        assertThat(event.actorId()).isEqualTo("kiosk-7");
        assertThat(event.action()).isEqualTo("GUEST_SERVICE_REQUESTED");
        assertThat(event.resourceType()).isEqualTo("HOUSEKEEPING");
        assertThat(event.resourceId()).isEqualTo("/services");
        assertThat(event.result()).isEqualTo("SUCCESS");
        assertThat(event.correlationId()).isEqualTo("correlation-123");
    }
}
