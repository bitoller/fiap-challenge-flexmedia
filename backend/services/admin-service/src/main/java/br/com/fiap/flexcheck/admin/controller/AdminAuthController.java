package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.AdminAuthenticationUseCase;
import br.com.fiap.flexcheck.admin.application.command.AdminLoginCommand;
import br.com.fiap.flexcheck.admin.service.result.AdminSessionResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/auth")
public class AdminAuthController {
    private final AdminAuthenticationUseCase adminAuthenticationUseCase;

    public AdminAuthController(AdminAuthenticationUseCase adminAuthenticationUseCase) {
        this.adminAuthenticationUseCase = adminAuthenticationUseCase;
    }

    @PostMapping("/login")
    public AdminSessionResult login(@Valid @RequestBody AdminLoginCommand command) {
        return adminAuthenticationUseCase.execute(command);
    }
}
