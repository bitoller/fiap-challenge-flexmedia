package br.com.fiap.flexcheck.checkin.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "fc_guest",
        uniqueConstraints = @UniqueConstraint(name = "uk_guest_document", columnNames = {"document_type", "document_number"})
)
public class GuestJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, length = 180)
    private String fullName;

    @Column(name = "document_type", nullable = false, length = 30)
    private String documentType;

    @Column(name = "document_number", nullable = false, length = 60)
    private String documentNumber;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "nationality", length = 80)
    private String nationality;

    @Column(name = "email", length = 160)
    private String email;

    @Column(name = "phone", length = 40)
    private String phone;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    protected GuestJpaEntity() {
    }
}
