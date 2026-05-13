package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.GetHotelProfileUseCase;
import br.com.fiap.flexcheck.admin.infrastructure.repository.InMemoryHotelRepository;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultGetHotelProfileUseCase implements GetHotelProfileUseCase {
    private final InMemoryHotelRepository hotelRepository;

    public DefaultGetHotelProfileUseCase(InMemoryHotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public HotelProfileResult execute(Long hotelId) {
        return hotelRepository.findById(hotelId);
    }
}
