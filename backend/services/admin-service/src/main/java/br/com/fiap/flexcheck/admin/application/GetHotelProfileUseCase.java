package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;

public interface GetHotelProfileUseCase {
    HotelProfileResult execute(Long hotelId);
}
