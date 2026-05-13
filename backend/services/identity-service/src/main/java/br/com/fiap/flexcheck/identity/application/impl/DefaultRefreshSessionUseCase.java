package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.RefreshSessionUseCase;
import br.com.fiap.flexcheck.identity.application.command.RefreshTokenCommand;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRefreshSessionUseCase implements RefreshSessionUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultRefreshSessionUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public AuthSessionResult execute(RefreshTokenCommand command) {
        return identityRepository.refresh(command);
    }
}
