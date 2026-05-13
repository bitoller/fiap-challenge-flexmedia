package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.service.CheckoutLookupUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutLookupCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCheckoutLookupUseCase implements CheckoutLookupUseCase {
    private final StayRepository stayRepository;

    public DefaultCheckoutLookupUseCase(StayRepository stayRepository) {
        this.stayRepository = stayRepository;
    }

    @Override
    public CheckoutPreviewResult execute(CheckoutLookupCommand command) {
        return stayRepository.findCheckoutPreview(
                        command.hotelId(),
                        command.roomNumber(),
                        command.documentType(),
                        command.documentNumber()
                )
                .orElseThrow(() -> new BusinessException(
                        "STAY_NOT_FOUND",
                        "Nao encontramos uma estadia ativa com esses dados.",
                        404
                ));
    }
}
