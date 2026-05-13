package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.UpdateHotelContentUseCase;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.infrastructure.repository.InMemoryHotelRepository;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultUpdateHotelContentUseCase implements UpdateHotelContentUseCase {
    private final InMemoryHotelRepository hotelRepository;

    public DefaultUpdateHotelContentUseCase(InMemoryHotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public HotelProfileResult execute(Long hotelId, UpdateHotelContentCommand command) {
        return hotelRepository.updateContent(hotelId, command);
    }
}
