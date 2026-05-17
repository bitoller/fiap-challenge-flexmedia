package br.com.fiap.flexcheck.checkin.service.impl;

import br.com.fiap.flexcheck.checkin.domain.exception.BusinessException;
import br.com.fiap.flexcheck.checkin.repository.StayRepository;
import br.com.fiap.flexcheck.checkin.service.CheckoutLookupUseCase;
import br.com.fiap.flexcheck.checkin.service.command.CheckoutLookupCommand;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutPreviewResult;
import br.com.fiap.flexcheck.checkin.service.result.CheckoutStayStateResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultCheckoutLookupUseCase implements CheckoutLookupUseCase {
    private final StayRepository stayRepository;

    public DefaultCheckoutLookupUseCase(StayRepository stayRepository) {
        this.stayRepository = stayRepository;
    }

    @Override
    public CheckoutPreviewResult execute(CheckoutLookupCommand command) {
        if (isBlank(command.roomNumber()) && isBlank(command.documentNumber())) {
            throw new BusinessException(
                    "STAY_NOT_FOUND",
                    "No active stay was found for the provided details.",
                    404
            );
        }

        var preview = stayRepository.findCheckoutPreview(
                        command.hotelId(),
                        command.roomNumber(),
                        command.documentType(),
                        command.documentNumber()
                )
                .orElse(null);

        if (preview != null) {
            return preview;
        }

        CheckoutStayStateResult stayState = stayRepository.findCheckoutState(
                command.hotelId(),
                command.roomNumber(),
                command.documentType(),
                command.documentNumber()
        ).orElse(null);

        if (stayState != null && stayState.stayStatus() != null && stayState.stayStatus().equalsIgnoreCase("CHECKED_OUT")) {
            throw new BusinessException(
                    "STAY_ALREADY_CHECKED_OUT",
                    "This stay has already been checked out. Start a new lookup if you need to review another stay.",
                    409
            );
        }

        throw new BusinessException(
                "STAY_NOT_FOUND",
                "No active stay was found for the provided details.",
                404
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
