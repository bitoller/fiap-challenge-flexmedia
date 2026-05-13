package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.UpdateHotelBrandingUseCase;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.infrastructure.repository.InMemoryHotelRepository;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultUpdateHotelBrandingUseCase implements UpdateHotelBrandingUseCase {
    private final InMemoryHotelRepository hotelRepository;

    public DefaultUpdateHotelBrandingUseCase(InMemoryHotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public HotelProfileResult execute(Long hotelId, UpdateHotelBrandingCommand command) {
        return hotelRepository.updateBranding(hotelId, command);
    }
}
