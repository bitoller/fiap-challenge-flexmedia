package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.LoginUseCase;
import br.com.fiap.flexcheck.identity.application.command.LoginCommand;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultLoginUseCase implements LoginUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultLoginUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public AuthSessionResult execute(LoginCommand command) {
        return identityRepository.login(command);
    }
}
