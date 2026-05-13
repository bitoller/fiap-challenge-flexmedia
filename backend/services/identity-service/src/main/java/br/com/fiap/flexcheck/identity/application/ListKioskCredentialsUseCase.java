package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;

import java.util.List;

public interface ListKioskCredentialsUseCase {
    List<KioskCredentialResult> execute();
}
