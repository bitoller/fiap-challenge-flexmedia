package br.com.fiap.flexcheck.checkin.repository;

import br.com.fiap.flexcheck.checkin.domain.entity.AuditEvent;

public interface AuditRepository {
    void record(AuditEvent event);
}

