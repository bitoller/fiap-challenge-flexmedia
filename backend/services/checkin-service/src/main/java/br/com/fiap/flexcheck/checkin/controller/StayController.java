package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.dto.CheckoutRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutLookupRequest;
import br.com.fiap.flexcheck.checkin.dto.CheckoutLookupResponse;
import br.com.fiap.flexcheck.checkin.dto.CheckoutResponse;
import br.com.fiap.flexcheck.checkin.mapper.ApiMapper;
import br.com.fiap.flexcheck.checkin.service.CheckoutLookupUseCase;
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
    private final CheckoutLookupUseCase checkoutLookupUseCase;

    public StayController(CheckoutUseCase checkoutUseCase, CheckoutLookupUseCase checkoutLookupUseCase) {
        this.checkoutUseCase = checkoutUseCase;
        this.checkoutLookupUseCase = checkoutLookupUseCase;
    }

    @PostMapping("/{stayId}/checkout")
    public CheckoutResponse checkout(
            @PathVariable Long stayId,
            @Valid @RequestBody CheckoutRequest request
    ) {
        return ApiMapper.toResponse(checkoutUseCase.execute(stayId, ApiMapper.toCommand(request)));
    }

    @PostMapping("/lookup")
    public CheckoutLookupResponse lookup(@Valid @RequestBody CheckoutLookupRequest request) {
        return ApiMapper.toResponse(checkoutLookupUseCase.execute(ApiMapper.toCommand(request)));
    }
}
