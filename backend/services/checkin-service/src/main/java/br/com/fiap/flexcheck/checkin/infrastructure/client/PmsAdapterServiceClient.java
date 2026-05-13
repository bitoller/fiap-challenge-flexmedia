package br.com.fiap.flexcheck.checkin.infrastructure.client;

import java.math.BigDecimal;

public interface PmsAdapterServiceClient {
    void syncCheckin(Long reservationId, Long stayId, Long roomId, String roomNumber, String guestName, BigDecimal totalAmount);

    void syncCheckout(Long reservationId, Long stayId, Long roomId, BigDecimal totalAmount);
}
