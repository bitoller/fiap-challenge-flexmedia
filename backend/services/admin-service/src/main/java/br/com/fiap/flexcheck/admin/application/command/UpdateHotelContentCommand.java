package br.com.fiap.flexcheck.admin.application.command;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record UpdateHotelContentCommand(
        @NotBlank String languageDefault,
        @NotEmpty List<@NotBlank String> supportedLanguages,
        @NotEmpty List<@Valid PromotionCommand> promotions,
        @NotEmpty List<@NotBlank String> amenities,
        @NotBlank String mapUrl,
        @NotBlank String supportMessage
) {
    public record PromotionCommand(
            @NotBlank String title,
            @NotBlank String description,
            boolean active,
            int order
    ) {
    }
}
