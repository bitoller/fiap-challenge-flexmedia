package br.com.fiap.flexcheck.admin.domain.entity;

public record AuditEvent(
        Long hotelId,
        String actorType,
        String actorId,
        String action,
        String resourceType,
        String resourceId,
        String result,
        String correlationId
) {
}
