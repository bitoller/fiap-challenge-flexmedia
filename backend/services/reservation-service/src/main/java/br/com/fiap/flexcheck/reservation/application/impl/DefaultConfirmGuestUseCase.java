package br.com.fiap.flexcheck.reservation.application.impl;

import br.com.fiap.flexcheck.reservation.application.ConfirmGuestUseCase;
import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class DefaultConfirmGuestUseCase implements ConfirmGuestUseCase {
    private final ReservationRepository reservationRepository;

    public DefaultConfirmGuestUseCase(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    @Transactional
    public void execute(Long reservationId, GuestConfirmationCommand command) {
        reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Reservation not found: " + reservationId));
        reservationRepository.updateGuest(reservationId, command);
    }
}
