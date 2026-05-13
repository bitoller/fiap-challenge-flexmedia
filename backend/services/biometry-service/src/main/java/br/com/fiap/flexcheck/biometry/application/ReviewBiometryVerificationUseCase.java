package br.com.fiap.flexcheck.biometry.application;

import br.com.fiap.flexcheck.biometry.application.command.BiometryReviewCommand;
import br.com.fiap.flexcheck.biometry.service.result.BiometryVerificationResult;

public interface ReviewBiometryVerificationUseCase {
    BiometryVerificationResult execute(Long verificationId, BiometryReviewCommand command);
}
