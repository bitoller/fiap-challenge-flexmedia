package br.com.fiap.flexcheck.reservation.controller;

import br.com.fiap.flexcheck.reservation.application.CreateReservationUseCase;
import br.com.fiap.flexcheck.reservation.application.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.reservation.application.DeleteReservationUseCase;
import br.com.fiap.flexcheck.reservation.application.ListReservationsUseCase;
import br.com.fiap.flexcheck.reservation.application.SearchReservationUseCase;
import br.com.fiap.flexcheck.reservation.application.command.CreateReservationCommand;
import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    private final CreateReservationUseCase createReservationUseCase;
    private final DeleteReservationUseCase deleteReservationUseCase;

    public ReservationController(
            SearchReservationUseCase searchReservationUseCase,
            ConfirmGuestUseCase confirmGuestUseCase,
            ListReservationsUseCase listReservationsUseCase,
            CreateReservationUseCase createReservationUseCase,
            DeleteReservationUseCase deleteReservationUseCase
    ) {
        this.searchReservationUseCase = searchReservationUseCase;
        this.confirmGuestUseCase = confirmGuestUseCase;
        this.listReservationsUseCase = listReservationsUseCase;
        this.createReservationUseCase = createReservationUseCase;
        this.deleteReservationUseCase = deleteReservationUseCase;
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

    @PostMapping("/hotels/{hotelId}")
    public ReservationResult createReservation(
            @PathVariable Long hotelId,
            @Valid @RequestBody CreateReservationRequest request
    ) {
        CreateReservationCommand hotelAwareCommand = new CreateReservationCommand(
                hotelId,
                request.hotelName(),
                request.roomNumber(),
                request.roomType(),
                request.reservationCode(),
                request.arrivalDate(),
                request.departureDate(),
                request.adults(),
                request.children(),
                request.totalAmount(),
                request.currency(),
                request.guestFullName(),
                request.guestDocumentType(),
                request.guestDocumentNumber(),
                request.guestBirthDate(),
                request.guestNationality(),
                request.guestEmail(),
                request.guestPhone()
        );
        return createReservationUseCase.execute(hotelAwareCommand);
    }

    @DeleteMapping("/hotels/{hotelId}/{reservationId}")
    public void deleteReservation(@PathVariable Long hotelId, @PathVariable Long reservationId) {
        deleteReservationUseCase.execute(hotelId, reservationId);
    }
}
