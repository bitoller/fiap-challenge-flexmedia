package br.com.fiap.flexcheck.reservation.application.impl;

import br.com.fiap.flexcheck.reservation.application.DeleteReservationUseCase;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import org.springframework.stereotype.Service;

@Service
public class DefaultDeleteReservationUseCase implements DeleteReservationUseCase {
    private final ReservationRepository reservationRepository;

    public DefaultDeleteReservationUseCase(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Override
    public void execute(Long hotelId, Long reservationId) {
        reservationRepository.deleteReservation(hotelId, reservationId);
    }
}
