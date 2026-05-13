package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.dto.AttachReservationRequest;
import br.com.fiap.flexcheck.checkin.dto.CompleteCheckinRequest;
import br.com.fiap.flexcheck.checkin.dto.CompleteCheckinResponse;
import br.com.fiap.flexcheck.checkin.dto.ConsentRequest;
import br.com.fiap.flexcheck.checkin.dto.CreateSessionRequest;
import br.com.fiap.flexcheck.checkin.dto.GuestConfirmationRequest;
import br.com.fiap.flexcheck.checkin.dto.SessionReservationResponse;
import br.com.fiap.flexcheck.checkin.dto.SessionResponse;
import br.com.fiap.flexcheck.checkin.mapper.ApiMapper;
import br.com.fiap.flexcheck.checkin.service.AttachReservationUseCase;
import br.com.fiap.flexcheck.checkin.service.CompleteCheckinUseCase;
import br.com.fiap.flexcheck.checkin.service.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.checkin.service.CreateSessionUseCase;
import br.com.fiap.flexcheck.checkin.service.RegisterConsentsUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/checkin-sessions")
public class CheckinSessionController {
    private final CreateSessionUseCase createSessionUseCase;
    private final AttachReservationUseCase attachReservationUseCase;
    private final ConfirmGuestUseCase confirmGuestUseCase;
    private final RegisterConsentsUseCase registerConsentsUseCase;
    private final CompleteCheckinUseCase completeCheckinUseCase;

    public CheckinSessionController(
            CreateSessionUseCase createSessionUseCase,
            AttachReservationUseCase attachReservationUseCase,
            ConfirmGuestUseCase confirmGuestUseCase,
            RegisterConsentsUseCase registerConsentsUseCase,
            CompleteCheckinUseCase completeCheckinUseCase
    ) {
        this.createSessionUseCase = createSessionUseCase;
        this.attachReservationUseCase = attachReservationUseCase;
        this.confirmGuestUseCase = confirmGuestUseCase;
        this.registerConsentsUseCase = registerConsentsUseCase;
        this.completeCheckinUseCase = completeCheckinUseCase;
    }

    @PostMapping
    public SessionResponse createSession(@Valid @RequestBody CreateSessionRequest request) {
        return ApiMapper.toResponse(createSessionUseCase.execute(ApiMapper.toCommand(request)));
    }

    @PostMapping("/{sessionId}/reservation")
    public SessionReservationResponse attachReservation(
            @PathVariable Long sessionId,
            @Valid @RequestBody AttachReservationRequest request
    ) {
        return ApiMapper.toResponse(attachReservationUseCase.execute(sessionId, ApiMapper.toCommand(request)));
    }

    @PostMapping("/{sessionId}/guest-confirmation")
    public Map<String, Object> confirmGuest(
            @PathVariable Long sessionId,
            @Valid @RequestBody GuestConfirmationRequest request
    ) {
        confirmGuestUseCase.execute(sessionId, ApiMapper.toCommand(request));
        return Map.of("sessionId", sessionId, "status", "DATA_CONFIRMED");
    }

    @PostMapping("/{sessionId}/consents")
    public Map<String, Object> registerConsents(
            @PathVariable Long sessionId,
            @Valid @RequestBody ConsentRequest request
    ) {
        registerConsentsUseCase.execute(sessionId, ApiMapper.toCommand(request));
        return Map.of("sessionId", sessionId, "status", "CONSENTS_REGISTERED");
    }

    @PostMapping("/{sessionId}/complete-checkin")
    public CompleteCheckinResponse completeCheckin(
            @PathVariable Long sessionId,
            @Valid @RequestBody CompleteCheckinRequest request
    ) {
        return ApiMapper.toResponse(completeCheckinUseCase.execute(sessionId, ApiMapper.toCommand(request)));
    }
}
