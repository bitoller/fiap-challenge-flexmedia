package br.com.fiap.flexcheck.identity.domain.entity;

import java.time.LocalDateTime;
import java.util.List;

public record UserAccount(
        Long id,
        String name,
        String username,
        String passwordHash,
        List<String> roles,
        boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
