package br.com.fiap.flexcheck.admin.application.command;

import jakarta.validation.constraints.NotBlank;

public record UpdateHotelBrandingCommand(
        @NotBlank String logoUrl,
        @NotBlank String primaryColor,
        @NotBlank String secondaryColor,
        @NotBlank String accentColor,
        @NotBlank String welcomeHeadline,
        @NotBlank String welcomeSubheadline
) {
}
