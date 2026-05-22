package br.com.fiap.flexcheck.admin.application.command;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record UpdateHotelBrandingCommand(
        @NotBlank String primaryColor,
        @NotBlank String secondaryColor,
        @NotBlank String accentColor,
        @NotBlank String surfaceColor,
        @NotBlank String textColor,
        String activePresetId,
        @Valid List<PresetCommand> presets
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PresetCommand(
            @NotBlank String id,
            @NotBlank String name,
            @NotBlank String primaryColor,
            @NotBlank String secondaryColor,
            @NotBlank String accentColor,
            @NotBlank String surfaceColor,
            @NotBlank String textColor
    ) {
    }
}
