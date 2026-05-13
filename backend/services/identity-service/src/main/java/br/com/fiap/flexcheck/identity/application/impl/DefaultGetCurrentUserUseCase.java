package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.GetCurrentUserUseCase;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.UserProfileResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultGetCurrentUserUseCase implements GetCurrentUserUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultGetCurrentUserUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public UserProfileResult execute(String accessToken) {
        return identityRepository.currentUser(accessToken);
    }
}
