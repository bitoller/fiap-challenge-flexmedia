package br.com.fiap.flexcheck.reservation.application.impl;

import br.com.fiap.flexcheck.reservation.application.CreateReservationUseCase;
import br.com.fiap.flexcheck.reservation.application.command.CreateReservationCommand;
import br.com.fiap.flexcheck.reservation.domain.entity.ReservationEligibility;
import br.com.fiap.flexcheck.reservation.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.reservation.mapper.ReservationMapper;
import br.com.fiap.flexcheck.reservation.repository.ReservationRepository;
import br.com.fiap.flexcheck.reservation.service.result.ReservationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCreateReservationUseCase implements CreateReservationUseCase {
    private final ReservationRepository reservationRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultCreateReservationUseCase(
            ReservationRepository reservationRepository,
            ReservationEligibilityPolicy eligibilityPolicy
    ) {
        this.reservationRepository = reservationRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    public ReservationResult execute(CreateReservationCommand command) {
        var reservation = reservationRepository.createReservation(command);
        ReservationEligibility eligibility = eligibilityPolicy.evaluate(reservation);
        return ReservationMapper.toResult(reservation, eligibility);
    }
}
