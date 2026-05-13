package br.com.fiap.flexcheck.admin.service.result;

import java.time.LocalDateTime;
import java.util.List;

public record HotelProfileResult(
        Long id,
        String name,
        String ownerName,
        String timezone,
        String checkinTime,
        String checkoutTime,
        int earlyCheckinMinutes,
        int lateCheckoutMinutes,
        BrandingResult branding,
        ContentResult content,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public record BrandingResult(
            String logoUrl,
            String primaryColor,
            String secondaryColor,
            String accentColor,
            String welcomeHeadline,
            String welcomeSubheadline
    ) {
    }

    public record ContentResult(
            String languageDefault,
            List<String> supportedLanguages,
            List<PromotionResult> promotions,
            List<String> amenities,
            String mapUrl,
            String supportMessage
    ) {
    }

    public record PromotionResult(
            String title,
            String description,
            boolean active,
            int order
    ) {
    }
}
