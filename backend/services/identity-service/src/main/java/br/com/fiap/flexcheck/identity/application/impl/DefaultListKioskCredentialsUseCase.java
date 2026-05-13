package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.ListKioskCredentialsUseCase;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DefaultListKioskCredentialsUseCase implements ListKioskCredentialsUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultListKioskCredentialsUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public List<KioskCredentialResult> execute() {
        return identityRepository.listKioskCredentials();
    }
}
