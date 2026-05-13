package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.CheckoutLookupCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;

public interface CheckoutLookupUseCase {
    CheckoutPreviewResult execute(CheckoutLookupCommand command);
}
