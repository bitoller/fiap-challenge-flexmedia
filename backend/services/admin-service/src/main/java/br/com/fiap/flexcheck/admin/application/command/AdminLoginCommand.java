package br.com.fiap.flexcheck.admin.application.command;

import jakarta.validation.constraints.NotBlank;

public record AdminLoginCommand(
        @NotBlank String username,
        @NotBlank String password
) {
}
