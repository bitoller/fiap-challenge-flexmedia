package br.com.fiap.flexcheck.reservation.repository;

import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.domain.entity.Reservation;

import java.util.Optional;

public interface ReservationRepository {
    Optional<Reservation> searchReservation(String searchType, String value);

    Optional<Reservation> findById(Long reservationId);

    void updateGuest(Long reservationId, GuestConfirmationCommand command);
}
