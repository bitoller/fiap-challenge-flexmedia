package br.com.fiap.flexcheck.identity.service.result;

import java.time.LocalDateTime;
import java.util.List;

public record UserProfileResult(
        Long id,
        String name,
        String username,
        List<String> roles,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
