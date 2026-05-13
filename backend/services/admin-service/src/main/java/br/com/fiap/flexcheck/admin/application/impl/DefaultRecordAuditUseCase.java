package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.RecordAuditUseCase;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.admin.infrastructure.persistence.OracleAuditRepository;
import org.springframework.stereotype.Service;

@Service
public class DefaultRecordAuditUseCase implements RecordAuditUseCase {
    private final OracleAuditRepository auditRepository;

    public DefaultRecordAuditUseCase(OracleAuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    @Override
    public void execute(AuditEvent event) {
        auditRepository.record(event);
    }
}
