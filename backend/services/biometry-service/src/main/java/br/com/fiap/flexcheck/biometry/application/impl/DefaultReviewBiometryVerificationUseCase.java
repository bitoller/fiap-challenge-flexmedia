package br.com.fiap.flexcheck.biometry.application.impl;

import br.com.fiap.flexcheck.biometry.application.ReviewBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.application.command.BiometryReviewCommand;
import br.com.fiap.flexcheck.biometry.infrastructure.repository.JdbcBiometryRepository;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultReviewBiometryVerificationUseCase implements ReviewBiometryVerificationUseCase {
    private final JdbcBiometryRepository biometryRepository;

    public DefaultReviewBiometryVerificationUseCase(JdbcBiometryRepository biometryRepository) {
        this.biometryRepository = biometryRepository;
    }

    @Override
    public BiometryVerificationResult execute(Long verificationId, BiometryReviewCommand command) {
        return biometryRepository.updateStatus(verificationId, command.status().trim().toUpperCase());
    }
}
