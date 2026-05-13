package br.com.fiap.flexcheck.biometry.application;

import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;

public interface FindBiometryVerificationUseCase {
    BiometryVerificationResult execute(Long verificationId);
}
