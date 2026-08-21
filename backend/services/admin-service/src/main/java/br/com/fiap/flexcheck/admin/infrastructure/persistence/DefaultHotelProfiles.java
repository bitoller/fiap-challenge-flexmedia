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
                                "#1f2937",
                                "#f8fafc",
                                "#f59e0b",
                                "#faf8f3",
                                "#1f2937",
                                "",
                                "warm-gold",
                                List.of(
                                        preset("original", "Original", "#b8860b", "#faf8f3", "#8b7355", "#faf8f3", "#2c2416"),
                                        flexMediaPreset(),
                                        preset("warm-gold", "Elegant Warm", "#1f2937", "#f8fafc", "#f59e0b", "#ffffff", "#1f2937"),
                                        preset("noir-lux", "Noir Luxe", "#0f172a", "#f8fafc", "#c084fc", "#111827", "#f8fafc")
                                )
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
                                "#2b1f3a",
                                "#f6efe7",
                                "#b8860b",
                                "#faf8f3",
                                "#2b1f3a",
                                "",
                                "coastal-luxe",
                                List.of(
                                        preset("original", "Original", "#b8860b", "#faf8f3", "#8b7355", "#faf8f3", "#2c2416"),
                                        flexMediaPreset(),
                                        preset("coastal-luxe", "Coastal Luxe", "#2b1f3a", "#f6efe7", "#b8860b", "#fffaf3", "#2b1f3a"),
                                        preset("sunset-terrace", "Sunset Terrace", "#4a2f19", "#fff4ea", "#ef8d32", "#fffaf4", "#4a2f19")
                                )
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
                                "#243447",
                                "#faf7f0",
                                "#af8a3d",
                                "#ffffff",
                                "#243447",
                                "",
                                "garden-calm",
                                List.of(
                                        preset("original", "Original", "#b8860b", "#faf8f3", "#8b7355", "#faf8f3", "#2c2416"),
                                        flexMediaPreset(),
                                        preset("garden-calm", "Garden Calm", "#243447", "#faf7f0", "#af8a3d", "#ffffff", "#243447"),
                                        preset("botanical-soft", "Botanical Soft", "#1f3d33", "#f4f7f3", "#5a8a62", "#ffffff", "#1f3d33")
                                )
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
                        "#111827",
                        "#ecfeff",
                "#f59e0b",
                "#faf8f3",
                "#111827",
                "",
                "default-luxe",
                List.of(
                        preset("original", "Original", "#b8860b", "#faf8f3", "#8b7355", "#faf8f3", "#2c2416"),
                        flexMediaPreset(),
                        preset("default-luxe", "Default Luxe", "#111827", "#ecfeff", "#f59e0b", "#ffffff", "#111827")
                )
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

    private static HotelProfile.Preset preset(
            String id,
            String name,
            String primaryColor,
            String secondaryColor,
            String accentColor,
            String surfaceColor,
            String textColor
    ) {
        return new HotelProfile.Preset(
                id,
                name,
                primaryColor,
                secondaryColor,
                accentColor,
                surfaceColor,
                textColor
        );
    }

    private static HotelProfile.Preset flexMediaPreset() {
        return preset(
                "flexmedia",
                "FlexMedia",
                "#49663b",
                "#f4f7ef",
                "#5bbd5e",
                "#ffffff",
                "#1f2d1d"
        );
    }
}
