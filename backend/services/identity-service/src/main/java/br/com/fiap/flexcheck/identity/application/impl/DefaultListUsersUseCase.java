package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.ListUsersUseCase;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.UserSummaryResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListUsersUseCase implements ListUsersUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultListUsersUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public List<UserSummaryResult> execute() {
        return identityRepository.listUsers();
    }
}
