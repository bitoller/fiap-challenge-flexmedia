package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.dto.CheckoutRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutResponse;
import br.com.fiap.flexcheck.checkin.mapper.ApiMapper;
import br.com.fiap.flexcheck.checkin.service.CheckoutUseCase;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/stays")
public class StayController {
    private final CheckoutUseCase checkoutUseCase;

    public StayController(CheckoutUseCase checkoutUseCase) {
        this.checkoutUseCase = checkoutUseCase;
    }

    @PostMapping("/{stayId}/checkout")
    public CheckoutResponse checkout(
            @PathVariable Long stayId,
            @Valid @RequestBody CheckoutRequest request
    ) {
        return ApiMapper.toResponse(checkoutUseCase.execute(stayId, ApiMapper.toCommand(request)));
    }
}
