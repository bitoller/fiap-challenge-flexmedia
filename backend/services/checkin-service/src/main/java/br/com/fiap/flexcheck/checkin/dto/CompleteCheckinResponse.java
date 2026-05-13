package br.com.fiap.flexcheck.checkin.dto;

import java.math.BigDecimal;

public record CompleteCheckinResponse(
        Long sessionId,
        String status,
        Long stayId,
        String roomNumber,
        BigDecimal totalPaid,
        KeyResponse key
) {
}
