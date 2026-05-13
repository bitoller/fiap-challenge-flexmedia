package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.entity.Stay;

import java.util.Optional;

public interface StayRepository {
    Long createStay(Reservation reservation);

    Optional<Stay> findStay(Long stayId);

    void markCheckedIn(Long sessionId, Long reservationId, Long roomId);

    void checkout(Stay stay);
}

