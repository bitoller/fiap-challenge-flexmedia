package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.GetHotelProfileUseCase;
import br.com.fiap.flexcheck.admin.application.ListHotelsUseCase;
import br.com.fiap.flexcheck.admin.application.UpdateHotelBrandingUseCase;
import br.com.fiap.flexcheck.admin.application.UpdateHotelContentUseCase;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/hotels")
public class HotelAdminController {
    private final ListHotelsUseCase listHotelsUseCase;
    private final GetHotelProfileUseCase getHotelProfileUseCase;
    private final UpdateHotelBrandingUseCase updateHotelBrandingUseCase;
    private final UpdateHotelContentUseCase updateHotelContentUseCase;

    public HotelAdminController(
            ListHotelsUseCase listHotelsUseCase,
            GetHotelProfileUseCase getHotelProfileUseCase,
            UpdateHotelBrandingUseCase updateHotelBrandingUseCase,
            UpdateHotelContentUseCase updateHotelContentUseCase
    ) {
        this.listHotelsUseCase = listHotelsUseCase;
        this.getHotelProfileUseCase = getHotelProfileUseCase;
        this.updateHotelBrandingUseCase = updateHotelBrandingUseCase;
        this.updateHotelContentUseCase = updateHotelContentUseCase;
    }

    @GetMapping
    public List<HotelSummaryResult> listHotels() {
        return listHotelsUseCase.execute();
    }

    @GetMapping("/{hotelId}")
    public HotelProfileResult getHotel(@PathVariable Long hotelId) {
        return getHotelProfileUseCase.execute(hotelId);
    }

    @PutMapping("/{hotelId}/branding")
    public HotelProfileResult updateBranding(@PathVariable Long hotelId, @Valid @RequestBody UpdateHotelBrandingCommand command) {
        return updateHotelBrandingUseCase.execute(hotelId, command);
    }

    @PutMapping("/{hotelId}/content")
    public HotelProfileResult updateContent(@PathVariable Long hotelId, @Valid @RequestBody UpdateHotelContentCommand command) {
        return updateHotelContentUseCase.execute(hotelId, command);
    }
}
