package br.com.fiap.flexcheck.checkin.dto;

import jakarta.validation.constraints.NotBlank;

public record AttachReservationRequest(
        @NotBlank String searchType,
        @NotBlank String searchValue
) {
}
