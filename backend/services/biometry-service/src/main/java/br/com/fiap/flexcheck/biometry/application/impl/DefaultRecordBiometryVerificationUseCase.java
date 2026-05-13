package br.com.fiap.flexcheck.biometry.application.impl;

import br.com.fiap.flexcheck.biometry.application.RecordBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.application.command.BiometryVerificationCommand;
import br.com.fiap.flexcheck.biometry.infrastructure.repository.JdbcBiometryRepository;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class DefaultRecordBiometryVerificationUseCase implements RecordBiometryVerificationUseCase {
    private final JdbcBiometryRepository biometryRepository;

    public DefaultRecordBiometryVerificationUseCase(JdbcBiometryRepository biometryRepository) {
        this.biometryRepository = biometryRepository;
    }

    @Override
    public BiometryVerificationResult execute(BiometryVerificationCommand command) {
        String status = decideStatus(command);
        return biometryRepository.insertVerification(
                command.sessionId(),
                command.guestId(),
                status,
                defaultValue(command.templateReference(), status + "-" + command.sessionId()),
                defaultConfidence(status, command.confidence())
        );
    }

    private String decideStatus(BiometryVerificationCommand command) {
        if (command.consentGranted() != null && !command.consentGranted()) {
            return "SKIPPED";
        }
        if (command.requestedStatus() != null && !command.requestedStatus().isBlank()) {
            return command.requestedStatus().trim().toUpperCase();
        }
        BigDecimal confidence = command.confidence();
        if (confidence == null) {
            return "MANUAL_REVIEW";
        }
        if (confidence.compareTo(BigDecimal.valueOf(85)) >= 0) {
            return "APPROVED";
        }
        if (confidence.compareTo(BigDecimal.valueOf(60)) >= 0) {
            return "MANUAL_REVIEW";
        }
        return "REJECTED";
    }

    private BigDecimal defaultConfidence(String status, BigDecimal confidence) {
        if (confidence != null) {
            return confidence;
        }
        return switch (status) {
            case "APPROVED" -> BigDecimal.valueOf(98.5);
            case "MANUAL_REVIEW" -> BigDecimal.valueOf(72.0);
            case "REJECTED" -> BigDecimal.valueOf(12.5);
            default -> null;
        };
    }

    private String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }
}
