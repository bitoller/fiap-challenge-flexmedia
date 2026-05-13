package br.com.fiap.flexcheck.key.application;

import br.com.fiap.flexcheck.key.application.command.IssueKeyCommand;
import br.com.fiap.flexcheck.key.service.result.KeyResult;

public interface IssueKeyUseCase {
    KeyResult execute(IssueKeyCommand command);
}
