package br.com.fiap.flexcheck.checkin.dto;

import java.time.LocalDateTime;

public record KeyResponse(
        Long keyId,
        String type,
        String status,
        String value,
        LocalDateTime expiresAt
) {
}
