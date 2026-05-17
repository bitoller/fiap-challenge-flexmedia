package br.com.fiap.flexcheck.reservation.application.impl;

import static org.springframework.http.HttpStatus.NOT_FOUND;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import br.com.fiap.flexcheck.reservation.application.SearchReservationUseCase;
import br.com.fiap.flexcheck.reservation.domain.entity.Reservation;
import br.com.fiap.flexcheck.reservation.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.reservation.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.reservation.mapper.ReservationMapper;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;

@Service
public class DefaultSearchReservationUseCase implements SearchReservationUseCase {
    private final ReservationRepository reservationRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultSearchReservationUseCase(
            ReservationRepository reservationRepository,
            ReservationEligibilityPolicy eligibilityPolicy) {
        this.reservationRepository = reservationRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    public ReservationResult execute(Long kioskId, Long hotelId, String type, String value) {
        Reservation reservation = reservationRepository.searchReservation(kioskId, hotelId, type, value)
                .orElseThrow(
                        () -> new ResponseStatusException(NOT_FOUND, "Reservation not found for search type " + type));
        ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
        return ReservationMapper.toResult(reservation, eligibility);
    }

    @Override
    public ReservationResult findById(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Reservation not found: " + reservationId));
        ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
        return ReservationMapper.toResult(reservation, eligibility);
    }
}
