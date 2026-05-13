package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.service.result.UserProfileResult;

public interface GetCurrentUserUseCase {
    UserProfileResult execute(String accessToken);
}
