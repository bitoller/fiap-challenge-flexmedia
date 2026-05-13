package br.com.fiap.flexcheck.reservation.repository;

import br.com.fiap.flexcheck.reservation.application.command.GuestConfirmationCommand;
import br.com.fiap.flexcheck.reservation.domain.entity.Reservation;

import java.util.Optional;

public interface ReservationRepository {
    Optional<Reservation> searchReservation(Long kioskId, Long hotelId, String searchType, String value);

    Optional<Reservation> findById(Long reservationId);

    java.util.List<Reservation> listByHotelId(Long hotelId);

    void updateGuest(Long reservationId, GuestConfirmationCommand command);
}
