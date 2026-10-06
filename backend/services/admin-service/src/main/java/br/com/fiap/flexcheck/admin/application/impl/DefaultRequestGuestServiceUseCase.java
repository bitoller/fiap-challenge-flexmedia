package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.RecordAuditUseCase;
import br.com.fiap.flexcheck.admin.application.RequestGuestServiceUseCase;
import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class DefaultRequestGuestServiceUseCase implements RequestGuestServiceUseCase {
    private final RecordAuditUseCase recordAuditUseCase;

    public DefaultRequestGuestServiceUseCase(RecordAuditUseCase recordAuditUseCase) {
        this.recordAuditUseCase = recordAuditUseCase;
    }

    @Override
    public void execute(GuestServiceRequestCommand command) {
        String correlationId = command.correlationId() == null || command.correlationId().isBlank()
                ? UUID.randomUUID().toString()
                : command.correlationId();

        recordAuditUseCase.execute(new AuditEvent(
                command.hotelId(),
                "KIOSK",
                command.kioskId(),
                "GUEST_SERVICE_REQUESTED",
                command.serviceType().name(),
                command.route(),
                "SUCCESS",
                correlationId,
                null
        ));
    }
}
