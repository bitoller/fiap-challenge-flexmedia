package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;

public interface UpdateHotelBrandingUseCase {
    HotelProfileResult execute(Long hotelId, UpdateHotelBrandingCommand command);
}
