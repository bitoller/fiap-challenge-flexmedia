package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.dto.ReservationResponse;
import br.com.fiap.flexcheck.checkin.mapper.ApiMapper;
import br.com.fiap.flexcheck.checkin.service.SearchReservationUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {
    private final SearchReservationUseCase searchReservationUseCase;

    public ReservationController(SearchReservationUseCase searchReservationUseCase) {
        this.searchReservationUseCase = searchReservationUseCase;
    }

    @GetMapping("/search")
    public ReservationResponse searchReservation(
            @RequestParam String type,
            @RequestParam String value
    ) {
        return ApiMapper.toResponse(searchReservationUseCase.execute(type, value));
    }
}
