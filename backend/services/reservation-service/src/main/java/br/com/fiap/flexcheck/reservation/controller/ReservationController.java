package br.com.fiap.flexcheck.reservation.controller;

import br.com.fiap.flexcheck.reservation.application.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.reservation.application.ListReservationsUseCase;
import br.com.fiap.flexcheck.reservation.application.SearchReservationUseCase;
import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {
    private final SearchReservationUseCase searchReservationUseCase;
    private final ConfirmGuestUseCase confirmGuestUseCase;
    private final ListReservationsUseCase listReservationsUseCase;

    public ReservationController(
            SearchReservationUseCase searchReservationUseCase,
            ConfirmGuestUseCase confirmGuestUseCase,
            ListReservationsUseCase listReservationsUseCase
    ) {
        this.searchReservationUseCase = searchReservationUseCase;
        this.confirmGuestUseCase = confirmGuestUseCase;
        this.listReservationsUseCase = listReservationsUseCase;
    }

    @GetMapping("/search")
    public ReservationResult searchReservation(
            @RequestParam(required = false) Long kioskId,
            @RequestParam(required = false) Long hotelId,
            @RequestParam String type,
            @RequestParam String value
    ) {
        return searchReservationUseCase.execute(kioskId, hotelId, type, value);
    }

    @GetMapping("/hotels/{hotelId}")
    public List<ReservationResult> listByHotel(@PathVariable Long hotelId) {
        return listReservationsUseCase.execute(hotelId);
    }

    @GetMapping("/{reservationId}")
    public ReservationResult findById(@PathVariable Long reservationId) {
        return searchReservationUseCase.findById(reservationId);
    }

    @PostMapping("/{reservationId}/guest-confirmation")
    public void confirmGuest(
            @PathVariable Long reservationId,
            @Valid @RequestBody GuestConfirmationCommand command
    ) {
        confirmGuestUseCase.execute(reservationId, command);
    }
}
