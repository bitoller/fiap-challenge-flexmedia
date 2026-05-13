package br.com.fiap.flexcheck.identity.application.impl;

import br.com.fiap.flexcheck.identity.application.RegisterKioskCredentialUseCase;
import br.com.fiap.flexcheck.identity.application.command.CreateKioskCredentialCommand;
import br.com.fiap.flexcheck.identity.infrastructure.repository.InMemoryIdentityRepository;
import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultRegisterKioskCredentialUseCase implements RegisterKioskCredentialUseCase {
    private final InMemoryIdentityRepository identityRepository;

    public DefaultRegisterKioskCredentialUseCase(InMemoryIdentityRepository identityRepository) {
        this.identityRepository = identityRepository;
    }

    @Override
    public KioskCredentialResult execute(CreateKioskCredentialCommand command) {
        return identityRepository.createKioskCredential(command);
    }
}
