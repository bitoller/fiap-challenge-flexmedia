package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.application.command.CreateKioskCredentialCommand;
import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;

public interface RegisterKioskCredentialUseCase {
    KioskCredentialResult execute(CreateKioskCredentialCommand command);
}
