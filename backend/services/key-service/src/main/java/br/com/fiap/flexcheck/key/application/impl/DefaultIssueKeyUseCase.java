package br.com.fiap.flexcheck.key.application.impl;

import br.com.fiap.flexcheck.key.application.IssueKeyUseCase;
import br.com.fiap.flexcheck.key.application.command.IssueKeyCommand;
import br.com.fiap.flexcheck.key.infrastructure.repository.InMemoryKeyRepository;
import br.com.fiap.flexcheck.key.service.result.KeyResult;
import org.springframework.stereotype.Service;

@Service
public class DefaultIssueKeyUseCase implements IssueKeyUseCase {
    private final InMemoryKeyRepository keyRepository;

    public DefaultIssueKeyUseCase(InMemoryKeyRepository keyRepository) {
        this.keyRepository = keyRepository;
    }

    @Override
    public KeyResult execute(IssueKeyCommand command) {
        return keyRepository.createKey(command.stayId(), command.roomId(), command.keyType(), command.departureDate());
    }
}
