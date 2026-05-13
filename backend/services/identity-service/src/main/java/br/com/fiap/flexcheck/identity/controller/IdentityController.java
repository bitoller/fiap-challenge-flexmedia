package br.com.fiap.flexcheck.identity.controller;

import br.com.fiap.flexcheck.identity.application.GetCurrentUserUseCase;
import br.com.fiap.flexcheck.identity.application.ListKioskCredentialsUseCase;
import br.com.fiap.flexcheck.identity.application.ListUsersUseCase;
import br.com.fiap.flexcheck.identity.application.LoginUseCase;
import br.com.fiap.flexcheck.identity.application.RefreshSessionUseCase;
import br.com.fiap.flexcheck.identity.application.RegisterKioskCredentialUseCase;
import br.com.fiap.flexcheck.identity.application.command.CreateKioskCredentialCommand;
import br.com.fiap.flexcheck.identity.application.command.LoginCommand;
import br.com.fiap.flexcheck.identity.application.command.RefreshTokenCommand;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;
import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;
import br.com.fiap.flexcheck.identity.service.result.UserProfileResult;
import br.com.fiap.flexcheck.identity.service.result.UserSummaryResult;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class IdentityController {
    private final LoginUseCase loginUseCase;
    private final RefreshSessionUseCase refreshSessionUseCase;
    private final GetCurrentUserUseCase getCurrentUserUseCase;
    private final ListUsersUseCase listUsersUseCase;
    private final RegisterKioskCredentialUseCase registerKioskCredentialUseCase;
    private final ListKioskCredentialsUseCase listKioskCredentialsUseCase;

    public IdentityController(
            LoginUseCase loginUseCase,
            RefreshSessionUseCase refreshSessionUseCase,
            GetCurrentUserUseCase getCurrentUserUseCase,
            ListUsersUseCase listUsersUseCase,
            RegisterKioskCredentialUseCase registerKioskCredentialUseCase,
            ListKioskCredentialsUseCase listKioskCredentialsUseCase
    ) {
        this.loginUseCase = loginUseCase;
        this.refreshSessionUseCase = refreshSessionUseCase;
        this.getCurrentUserUseCase = getCurrentUserUseCase;
        this.listUsersUseCase = listUsersUseCase;
        this.registerKioskCredentialUseCase = registerKioskCredentialUseCase;
        this.listKioskCredentialsUseCase = listKioskCredentialsUseCase;
    }

    @PostMapping("/auth/login")
    public AuthSessionResult login(@Valid @RequestBody LoginCommand command) {
        return loginUseCase.execute(command);
    }

    @PostMapping("/auth/refresh")
    public AuthSessionResult refresh(@Valid @RequestBody RefreshTokenCommand command) {
        return refreshSessionUseCase.execute(command);
    }

    @GetMapping("/users/me")
    public UserProfileResult me(@RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization) {
        return getCurrentUserUseCase.execute(extractBearerToken(authorization));
    }

    @GetMapping("/users")
    public List<UserSummaryResult> listUsers() {
        return listUsersUseCase.execute();
    }

    @PostMapping("/kiosk-credentials")
    public KioskCredentialResult registerKioskCredential(@Valid @RequestBody CreateKioskCredentialCommand command) {
        return registerKioskCredentialUseCase.execute(command);
    }

    @GetMapping("/kiosk-credentials")
    public List<KioskCredentialResult> listKioskCredentials() {
        return listKioskCredentialsUseCase.execute();
    }

    private String extractBearerToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new IdentityUnauthorizedException();
        }
        return authorization.substring("Bearer ".length());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    private static final class IdentityUnauthorizedException extends RuntimeException {
    }
}
