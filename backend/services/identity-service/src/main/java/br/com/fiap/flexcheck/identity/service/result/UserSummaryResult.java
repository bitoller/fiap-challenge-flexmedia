package br.com.fiap.flexcheck.identity.service.result;

import java.util.List;

public record UserSummaryResult(
        Long id,
        String name,
        String username,
        List<String> roles,
        boolean active
) {
}
