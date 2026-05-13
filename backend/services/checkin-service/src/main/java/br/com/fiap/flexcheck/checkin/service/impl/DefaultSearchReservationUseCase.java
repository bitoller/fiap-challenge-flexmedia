package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.entity.Reservation;
import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.domain.service.ReservationEligibilityPolicy;
import br.com.fiap.flexcheck.checkin.mapper.ResultMapper;
import br.com.fiap.flexcheck.checkin.repository.ReservationRepository;
import br.com.fiap.flexcheck.checkin.service.SearchReservationUseCase;
import br.com.fiap.flexcheck.checkin.service.result.ReservationResult;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class DefaultSearchReservationUseCase implements SearchReservationUseCase {
    private final ReservationRepository reservationRepository;
    private final ReservationEligibilityPolicy eligibilityPolicy;

    public DefaultSearchReservationUseCase(ReservationRepository reservationRepository, ReservationEligibilityPolicy eligibilityPolicy) {
        this.reservationRepository = reservationRepository;
        this.eligibilityPolicy = eligibilityPolicy;
    }

    @Override
    public ReservationResult execute(String type, String value) {
        Reservation reservation = reservationRepository.findReservation(type, value)
                .orElseThrow(() -> new BusinessException(
                        "RESERVATION_NOT_FOUND",
                        "Nao encontramos uma reserva com esses dados.",
                        404,
                        Map.of("searchType", type)
                ));
        return ResultMapper.toReservationResult(reservation, eligibilityPolicy.evaluate(reservation));
    }
}
