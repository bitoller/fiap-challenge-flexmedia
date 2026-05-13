package br.com.fiap.flexcheck.biometry.application.impl;

import br.com.fiap.flexcheck.biometry.application.FindBiometryVerificationUseCase;
import br.com.fiap.flexcheck.biometry.infrastructure.repository.JdbcBiometryRepository;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultFindBiometryVerificationUseCase implements FindBiometryVerificationUseCase {
    private final JdbcBiometryRepository biometryRepository;

    public DefaultFindBiometryVerificationUseCase(JdbcBiometryRepository biometryRepository) {
        this.biometryRepository = biometryRepository;
    }

    @Override
    public BiometryVerificationResult execute(Long verificationId) {
        return biometryRepository.findById(verificationId);
    }
}
