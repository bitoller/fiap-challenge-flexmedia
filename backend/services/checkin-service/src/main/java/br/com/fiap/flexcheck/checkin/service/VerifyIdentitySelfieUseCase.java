package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.IdentitySelfieVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;

public interface VerifyIdentitySelfieUseCase {
    IdentityVerificationResult execute(Long sessionId, IdentitySelfieVerificationCommand command);
}
