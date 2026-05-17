package br.com.fiap.flexcheck.checkin.service;

import br.com.fiap.flexcheck.checkin.service.command.IdentityDocumentVerificationCommand;
import br.com.fiap.flexcheck.checkin.service.result.IdentityVerificationResult;

public interface VerifyIdentityDocumentUseCase {
    IdentityVerificationResult execute(Long sessionId, IdentityDocumentVerificationCommand command);
}
