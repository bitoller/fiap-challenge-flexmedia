package br.com.fiap.flexcheck.reservation.application.impl;

import br.com.fiap.flexcheck.reservation.application.ListReservationsUseCase;
import br.com.fiap.flexcheck.reservation.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.reservation.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.reservation.mapper.ReservationMapper;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListReservationsUseCase implements ListReservationsUseCase {
    private final ReservationRepository reservationRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultListReservationsUseCase(
            ReservationRepository reservationRepository,
            ReservationEligibilityPolicy eligibilityPolicy
    ) {
        this.reservationRepository = reservationRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    public List<ReservationResult> execute(Long hotelId) {
        return reservationRepository.listByHotelId(hotelId).stream()
                .map(reservation -> {
                    ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
                    return ReservationMapper.toResult(reservation, eligibility);
                })
                .toList();
    }
}
