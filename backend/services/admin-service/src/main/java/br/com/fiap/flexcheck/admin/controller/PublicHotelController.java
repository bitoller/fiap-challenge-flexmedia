package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.GetHotelProfileUseCase;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hotels")
public class PublicHotelController {
    private final GetHotelProfileUseCase getHotelProfileUseCase;

    public PublicHotelController(GetHotelProfileUseCase getHotelProfileUseCase) {
        this.getHotelProfileUseCase = getHotelProfileUseCase;
    }

    @GetMapping("/{hotelId}")
    public HotelProfileResult getHotel(@PathVariable Long hotelId) {
        return getHotelProfileUseCase.execute(hotelId);
    }
}
