package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.application.command.RefreshTokenCommand;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;

public interface RefreshSessionUseCase {
    AuthSessionResult execute(RefreshTokenCommand command);
}
