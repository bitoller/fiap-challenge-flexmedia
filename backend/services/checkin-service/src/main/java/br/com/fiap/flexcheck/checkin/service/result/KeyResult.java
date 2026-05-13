package br.com.fiap.flexcheck.checkin.service.result;

import java.time.LocalDateTime;

public record KeyResult(
        Long keyId,
        String type,
        String status,
        String value,
        LocalDateTime expiresAt
) {
}

