package br.com.fiap.flexcheck.key.application.impl;

import br.com.fiap.flexcheck.key.application.RevokeKeysUseCase;
import br.com.fiap.flexcheck.key.infrastructure.repository.InMemoryKeyRepository;
import org.springframework.stereotype.Service;

@Service
public class DefaultRevokeKeysUseCase implements RevokeKeysUseCase {
    private final InMemoryKeyRepository keyRepository;

    public DefaultRevokeKeysUseCase(InMemoryKeyRepository keyRepository) {
        this.keyRepository = keyRepository;
    }

    @Override
    public void execute(Long stayId) {
        keyRepository.revokeKeys(stayId);
    }
}
