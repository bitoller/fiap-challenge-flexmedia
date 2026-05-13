package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;

public record ConsentItem(
        @NotBlank String type,
        boolean accepted,
        @NotBlank String version
) {
}
