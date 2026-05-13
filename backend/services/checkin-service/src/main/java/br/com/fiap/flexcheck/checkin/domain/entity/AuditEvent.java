package br.com.fiap.flexcheck.checkin.domain.entity;

public record AuditEvent(
        String actorType,
        String actorId,
        String action,
        String resourceType,
        String resourceId,
        String result,
        String correlationId
) {
}

