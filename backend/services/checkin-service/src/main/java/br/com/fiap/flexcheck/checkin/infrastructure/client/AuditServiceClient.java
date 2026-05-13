package br.com.fiap.flexcheck.checkin.infrastructure.client;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;

public interface AuditServiceClient {
    void record(AuditEvent event);
}
