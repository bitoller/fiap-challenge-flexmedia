package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_audit_log",
        indexes = @Index(name = "ix_audit_correlation", columnList = "correlation_id")
)
public class AuditLogJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actor_type", nullable = false, length = 30)
    private String actorType;

    @Column(name = "actor_id", length = 80)
    private String actorId;

    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Column(name = "resource_type", length = 80)
    private String resourceType;

    @Column(name = "resource_id", length = 80)
    private String resourceId;

    @Column(name = "result", nullable = false, length = 30)
    private String result;

    @Column(name = "correlation_id", length = 80)
    private String correlationId;

    @Column(name = "ip_address", length = 80)
    private String ipAddress;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected AuditLogJpaEntity() {
    }
}
