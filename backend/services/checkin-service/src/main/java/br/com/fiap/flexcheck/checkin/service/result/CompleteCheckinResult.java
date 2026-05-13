package br.com.fiap.flexcheck.checkin.service.result;

import java.math.BigDecimal;

public record CompleteCheckinResult(
        Long sessionId,
        String status,
        Long stayId,
        String roomNumber,
        BigDecimal totalPaid,
        KeyResult key
) {
}

