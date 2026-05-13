package br.com.fiap.flexcheck.admin.service.result;

import java.util.List;

public record AdminSessionResult(
        String token,
        String adminName,
        String role,
        List<HotelSummaryResult> hotels
) {
}
