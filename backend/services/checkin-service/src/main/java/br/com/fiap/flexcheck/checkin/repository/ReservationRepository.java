package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;

import java.util.Optional;

public interface ReservationRepository {
    Optional<Reservation> findReservation(String searchType, String value);
}

