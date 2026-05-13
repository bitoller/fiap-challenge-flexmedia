package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.application.command.LoginCommand;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;

public interface LoginUseCase {
    AuthSessionResult execute(LoginCommand command);
}
