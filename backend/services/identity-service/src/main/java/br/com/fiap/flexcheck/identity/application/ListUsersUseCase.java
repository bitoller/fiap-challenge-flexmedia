package br.com.fiap.flexcheck.identity.application;

import br.com.fiap.flexcheck.identity.service.result.UserSummaryResult;

import java.util.List;

public interface ListUsersUseCase {
    List<UserSummaryResult> execute();
}
