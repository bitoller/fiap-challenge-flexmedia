package br.com.fiap.flexcheck.checkin.dto;

import java.util.List;

public record ApplyCheckinAddOnsRequest(
        List<String> selectedCodes
) {
}
