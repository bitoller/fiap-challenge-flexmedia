package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.CheckoutCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutResult;

public interface CheckoutUseCase {
    CheckoutResult execute(Long stayId, CheckoutCommand command);
}
