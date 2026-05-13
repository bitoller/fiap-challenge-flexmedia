package br.com.fiap.flexcheck.admin.domain.entity;

import java.time.LocalDateTime;
import java.util.List;

public record HotelProfile(
        Long id,
        String name,
        String ownerName,
        String timezone,
        String checkinTime,
        String checkoutTime,
        int earlyCheckinMinutes,
        int lateCheckoutMinutes,
        Branding branding,
        Content content,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record Branding(
            String logoUrl,
            String primaryColor,
            String secondaryColor,
            String accentColor,
            String welcomeHeadline,
            String welcomeSubheadline
    ) {
    }

    public record Content(
            String languageDefault,
            List<String> supportedLanguages,
            List<Promotion> promotions,
            List<String> amenities,
            String mapUrl,
            String supportMessage
    ) {
    }

    public record Promotion(
            String title,
            String description,
            boolean active,
            int order
    ) {
    }
}
