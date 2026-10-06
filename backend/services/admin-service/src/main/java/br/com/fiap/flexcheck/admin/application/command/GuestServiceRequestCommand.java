package br.com.fiap.flexcheck.admin.application.command;

import br.com.fiap.flexcheck.admin.domain.entity.GuestServiceType;

public record GuestServiceRequestCommand(
        Long hotelId,
        String kioskId,
        GuestServiceType serviceType,
        String route,
        String correlationId
) {
}
