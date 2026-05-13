package br.com.fiap.flexcheck.admin.application;

import br.com.fiap.flexcheck.admin.application.command.AdminLoginCommand;
import br.com.fiap.flexcheck.admin.service.result.AdminSessionResult;

public interface AdminAuthenticationUseCase {
    AdminSessionResult execute(AdminLoginCommand command);
}
