package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.RequestGuestServiceUseCase;
import br.com.fiap.flexcheck.admin.application.command.GuestServiceRequestCommand;
import br.com.fiap.flexcheck.admin.domain.entity.GuestServiceType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/guest-service-requests")
public class GuestServiceRequestController {
    private final RequestGuestServiceUseCase requestGuestServiceUseCase;

    public GuestServiceRequestController(RequestGuestServiceUseCase requestGuestServiceUseCase) {
        this.requestGuestServiceUseCase = requestGuestServiceUseCase;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void requestService(
            @Valid @RequestBody GuestServiceRequest request,
            @RequestHeader(value = "X-Correlation-Id", required = false) String correlationId
    ) {
        requestGuestServiceUseCase.execute(new GuestServiceRequestCommand(
                request.hotelId(),
                request.kioskId(),
                request.serviceType(),
                request.route(),
                request.roomNumber(),
                correlationId
        ));
    }

    public record GuestServiceRequest(
            @NotNull @Positive Long hotelId,
            @NotBlank @Size(max = 80) String kioskId,
            @NotNull GuestServiceType serviceType,
            @NotBlank @Size(max = 500) String route,
            @Size(max = 20) String roomNumber
    ) {
    }
}
