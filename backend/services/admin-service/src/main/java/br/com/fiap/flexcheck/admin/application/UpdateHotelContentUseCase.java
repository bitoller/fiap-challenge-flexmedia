package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;

public interface UpdateHotelContentUseCase {
    HotelProfileResult execute(Long hotelId, UpdateHotelContentCommand command);
}
