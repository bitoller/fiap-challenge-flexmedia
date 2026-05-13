package br.com.fiap.flexcheck.admin.service.result;

public record HotelSummaryResult(
        Long id,
        String name,
        String ownerName,
        boolean active
) {
}
