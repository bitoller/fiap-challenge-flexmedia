package br.com.fiap.flexcheck.identity.service.result;

import java.time.LocalDateTime;

public record AuthSessionResult(
        String accessToken,
        String refreshToken,
        LocalDateTime expiresAt,
        UserProfileResult user
) {
}
