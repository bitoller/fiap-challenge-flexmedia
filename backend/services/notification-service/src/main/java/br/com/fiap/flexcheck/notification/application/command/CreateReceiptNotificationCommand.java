package br.com.fiap.flexcheck.notification.application.command;

import jakarta.validation.constraints.NotBlank;

public record CreateReceiptNotificationCommand(
        @NotBlank String channel,
        @NotBlank String recipient,
        @NotBlank String subject,
        @NotBlank String message,
        @NotBlank String relatedResourceType,
        @NotBlank String relatedResourceId
) {
}
