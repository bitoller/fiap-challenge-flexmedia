package br.com.fiap.flexcheck.checkin.service.result;

public record CheckoutStayStateResult(
        Long stayId,
        String stayStatus
) {
}
