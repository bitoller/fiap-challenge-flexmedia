package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;

public interface RecordAuditUseCase {
    void execute(AuditEvent event);
}
