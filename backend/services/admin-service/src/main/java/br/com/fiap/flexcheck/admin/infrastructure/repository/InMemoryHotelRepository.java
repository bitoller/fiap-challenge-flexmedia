package br.com.fiap.flexcheck.admin.infrastructure.repository;

import br.com.fiap.flexcheck.admin.application.command.UpdateHotelBrandingCommand;
import br.com.fiap.flexcheck.admin.application.command.UpdateHotelContentCommand;
import br.com.fiap.flexcheck.admin.domain.entity.HotelProfile;
import br.com.fiap.flexcheck.admin.domain.exception.HotelNotFoundException;
import br.com.fiap.flexcheck.admin.service.result.HotelProfileResult;
import br.com.fiap.flexcheck.admin.service.result.HotelSummaryResult;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Repository
public class InMemoryHotelRepository {
    private final ConcurrentMap<Long, HotelProfile> hotels = new ConcurrentHashMap<>();

    public InMemoryHotelRepository() {
        LocalDateTime now = LocalDateTime.now();
        hotels.put(1L, new HotelProfile(
                1L,
                "Flex Hotel Paulista",
                "FlexMedia",
                "America/Sao_Paulo",
                "14:00",
                "12:00",
                120,
                60,
                new HotelProfile.Branding(
                        "https://cdn.flexcheck.local/flex-hotel-paulista/logo.svg",
                        "#1f2937",
                        "#d1fae5",
                        "#f59e0b",
                        "Welcome to Flex Hotel Paulista",
                        "Fast, seamless and personalized check-in"
                ),
                new HotelProfile.Content(
                        "pt-BR",
                        List.of("pt-BR", "en-US", "es-ES"),
                        List.of(
                                new HotelProfile.Promotion("Spa Weekend", "20% off the spa package", true, 1),
                                new HotelProfile.Promotion("Restaurant Experience", "Reserve your dinner now", true, 2)
                        ),
                        List.of("Spa", "Pool", "Gym", "Restaurant"),
                        "https://maps.example.com/flex-hotel-paulista",
                        "Need help? Call reception 24/7."
                ),
                true,
                now,
                now
        ));

        hotels.put(2L, new HotelProfile(
                2L,
                "Flex Hotel Ipanema",
                "FlexMedia",
                "America/Sao_Paulo",
                "15:00",
                "11:00",
                90,
                45,
                new HotelProfile.Branding(
                        "https://cdn.flexcheck.local/flex-hotel-ipanema/logo.svg",
                        "#2b1f3a",
                        "#f6efe7",
                        "#b8860b",
                        "Welcome to Flex Hotel Ipanema",
                        "Ocean view, premium comfort"
                ),
                new HotelProfile.Content(
                        "pt-BR",
                        List.of("pt-BR", "en-US", "es-ES"),
                        List.of(
                                new HotelProfile.Promotion("Beach Breakfast", "Breakfast with sea view", true, 1)
                        ),
                        List.of("Beach", "Spa", "Restaurant"),
                        "https://maps.example.com/flex-hotel-ipanema",
                        "Need help? Our reception is available 24/7."
                ),
                true,
                now,
                now
        ));

        hotels.put(3L, new HotelProfile(
                3L,
                "Flex Hotel Jardim",
                "FlexMedia",
                "America/Sao_Paulo",
                "14:00",
                "12:00",
                120,
                60,
                new HotelProfile.Branding(
                        "https://cdn.flexcheck.local/flex-hotel-jardim/logo.svg",
                        "#243447",
                        "#faf7f0",
                        "#af8a3d",
                        "Welcome to Flex Hotel Jardim",
                        "Garden calm for every stay"
                ),
                new HotelProfile.Content(
                        "pt-BR",
                        List.of("pt-BR", "en-US", "es-ES"),
                        List.of(
                                new HotelProfile.Promotion("Garden Suite", "Premium suite with garden view", true, 1)
                        ),
                        List.of("Garden", "Pool", "Lounge"),
                        "https://maps.example.com/flex-hotel-jardim",
                        "We are here whenever you need us."
                ),
                true,
                now,
                now
        ));
    }

    public List<HotelSummaryResult> listHotels() {
        return hotels.values().stream()
                .map(this::toSummaryResult)
                .sorted((left, right) -> left.id().compareTo(right.id()))
                .toList();
    }

    public HotelProfileResult findById(Long hotelId) {
        return toResult(getHotel(hotelId));
    }

    public HotelProfileResult updateBranding(Long hotelId, UpdateHotelBrandingCommand command) {
        HotelProfile updated = hotels.compute(hotelId, (id, existing) -> {
            HotelProfile current = existing == null ? defaultHotel(id) : existing;
            LocalDateTime now = LocalDateTime.now();
            return new HotelProfile(
                    current.id(),
                    current.name(),
                    current.ownerName(),
                    current.timezone(),
                    current.checkinTime(),
                    current.checkoutTime(),
                    current.earlyCheckinMinutes(),
                    current.lateCheckoutMinutes(),
                    new HotelProfile.Branding(
                            command.logoUrl(),
                            command.primaryColor(),
                            command.secondaryColor(),
                            command.accentColor(),
                            command.welcomeHeadline(),
                            command.welcomeSubheadline()
                    ),
                    current.content(),
                    current.active(),
                    current.createdAt(),
                    now
            );
        });
        return toResult(updated);
    }

    public HotelProfileResult updateContent(Long hotelId, UpdateHotelContentCommand command) {
        HotelProfile updated = hotels.compute(hotelId, (id, existing) -> {
            HotelProfile current = existing == null ? defaultHotel(id) : existing;
            LocalDateTime now = LocalDateTime.now();
            return new HotelProfile(
                    current.id(),
                    current.name(),
                    current.ownerName(),
                    current.timezone(),
                    current.checkinTime(),
                    current.checkoutTime(),
                    current.earlyCheckinMinutes(),
                    current.lateCheckoutMinutes(),
                    current.branding(),
                    new HotelProfile.Content(
                            command.languageDefault(),
                            List.copyOf(command.supportedLanguages()),
                            command.promotions().stream()
                                    .map(promotion -> new HotelProfile.Promotion(
                                            promotion.title(),
                                            promotion.description(),
                                            promotion.active(),
                                            promotion.order()
                                    ))
                                    .toList(),
                            List.copyOf(command.amenities()),
                            command.mapUrl(),
                            command.supportMessage()
                    ),
                    current.active(),
                    current.createdAt(),
                    now
            );
        });
        return toResult(updated);
    }

    private HotelProfile getHotel(Long hotelId) {
        HotelProfile hotel = hotels.get(hotelId);
        if (hotel == null) {
            throw new HotelNotFoundException(hotelId);
        }
        return hotel;
    }

    private HotelProfile defaultHotel(Long hotelId) {
        LocalDateTime now = LocalDateTime.now();
        return new HotelProfile(
                hotelId,
                "Hotel " + hotelId,
                "FlexMedia",
                "America/Sao_Paulo",
                "14:00",
                "12:00",
                120,
                60,
                new HotelProfile.Branding(
                        "",
                        "#111827",
                        "#ecfeff",
                        "#f59e0b",
                        "Welcome",
                        "Enjoy your stay"
                ),
                new HotelProfile.Content(
                        "pt-BR",
                        List.of("pt-BR"),
                        List.of(),
                        List.of(),
                        "",
                        "Need help? Call reception."
                ),
                true,
                now,
                now
        );
    }

    private HotelSummaryResult toSummaryResult(HotelProfile hotel) {
        return new HotelSummaryResult(hotel.id(), hotel.name(), hotel.ownerName(), hotel.active());
    }

    private HotelProfileResult toResult(HotelProfile hotel) {
        return new HotelProfileResult(
                hotel.id(),
                hotel.name(),
                hotel.ownerName(),
                hotel.timezone(),
                hotel.checkinTime(),
                hotel.checkoutTime(),
                hotel.earlyCheckinMinutes(),
                hotel.lateCheckoutMinutes(),
                new HotelProfileResult.BrandingResult(
                        hotel.branding().logoUrl(),
                        hotel.branding().primaryColor(),
                        hotel.branding().secondaryColor(),
                        hotel.branding().accentColor(),
                        hotel.branding().welcomeHeadline(),
                        hotel.branding().welcomeSubheadline()
                ),
                new HotelProfileResult.ContentResult(
                        hotel.content().languageDefault(),
                        hotel.content().supportedLanguages(),
                        hotel.content().promotions().stream()
                                .map(promotion -> new HotelProfileResult.PromotionResult(
                                        promotion.title(),
                                        promotion.description(),
                                        promotion.active(),
                                        promotion.order()
                                ))
                                .toList(),
                        hotel.content().amenities(),
                        hotel.content().mapUrl(),
                        hotel.content().supportMessage()
                ),
                hotel.active(),
                hotel.createdAt(),
                hotel.updatedAt()
        );
    }

}
