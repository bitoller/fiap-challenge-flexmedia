package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.IdentityVerificationConfirmCommand;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;

public interface ConfirmIdentityVerificationUseCase {
    IdentityVerificationResult execute(Long sessionId, IdentityVerificationConfirmCommand command);
}
