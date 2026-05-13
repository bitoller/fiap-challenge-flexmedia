package br.com.fiap.flexcheck.admin.infrastructure.persistence;

import br.com.fiap.flexcheck.admin.domain.entity.HotelProfile;

import java.time.LocalDateTime;
import java.util.List;

final class DefaultHotelProfiles {
    private DefaultHotelProfiles() {
    }

    static List<HotelProfile> all() {
        LocalDateTime now = LocalDateTime.now();
        return List.of(
                profile(
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
                ),
                profile(
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
                ),
                profile(
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
                )
        );
    }

    static HotelProfile generic(Long hotelId) {
        LocalDateTime now = LocalDateTime.now();
        return profile(
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

    static HotelProfile findDefault(Long hotelId) {
        return all().stream()
                .filter(profile -> profile.id().equals(hotelId))
                .findFirst()
                .orElseGet(() -> generic(hotelId));
    }

    private static HotelProfile profile(
            Long id,
            String name,
            String ownerName,
            String timezone,
            String checkinTime,
            String checkoutTime,
            int earlyCheckinMinutes,
            int lateCheckoutMinutes,
            HotelProfile.Branding branding,
            HotelProfile.Content content,
            boolean active,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        return new HotelProfile(
                id,
                name,
                ownerName,
                timezone,
                checkinTime,
                checkoutTime,
                earlyCheckinMinutes,
                lateCheckoutMinutes,
                branding,
                content,
                active,
                createdAt,
                updatedAt
        );
    }
}
