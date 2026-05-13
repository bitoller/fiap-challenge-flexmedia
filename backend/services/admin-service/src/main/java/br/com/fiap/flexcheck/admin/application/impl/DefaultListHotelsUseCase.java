package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.ListHotelsUseCase;
import br.com.fiap.flexcheck.admin.infrastructure.persistence.OracleHotelRepository;
import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListHotelsUseCase implements ListHotelsUseCase {
    private final OracleHotelRepository hotelRepository;

    public DefaultListHotelsUseCase(OracleHotelRepository hotelRepository) {
        this.hotelRepository = hotelRepository;
    }

    @Override
    public List<HotelSummaryResult> execute() {
        return hotelRepository.listHotels();
    }
}
