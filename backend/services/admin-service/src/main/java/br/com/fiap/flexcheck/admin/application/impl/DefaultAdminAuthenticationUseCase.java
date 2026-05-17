package br.com.fiap.flexcheck.admin.application.impl;

import br.com.fiap.flexcheck.admin.application.AdminAuthenticationUseCase;
import br.com.fiap.flexcheck.admin.application.command.AdminLoginCommand;
import br.com.fiap.flexcheck.admin.infrastructure.persistence.OracleHotelRepository;
import br.com.fiap.flexcheck.admin.infrastructure.session.InMemoryAdminSessionRepository;
import br.com.fiap.flexcheck.admin.service.result.AdminSessionResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Service
public class DefaultAdminAuthenticationUseCase implements AdminAuthenticationUseCase {
    private final InMemoryAdminSessionRepository sessionRepository;
    private final OracleHotelRepository hotelRepository;
    private final String adminUsername;
    private final String adminPassword;
    private final String adminName;

    public DefaultAdminAuthenticationUseCase(
            InMemoryAdminSessionRepository sessionRepository,
            OracleHotelRepository hotelRepository,
            @Value("${ADMIN_USERNAME:}") String adminUsername,
            @Value("${ADMIN_PASSWORD:}") String adminPassword,
            @Value("${ADMIN_NAME:FlexCheck Administrator}") String adminName
    ) {
        this.sessionRepository = sessionRepository;
        this.hotelRepository = hotelRepository;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public AdminSessionResult execute(AdminLoginCommand command) {
        if (!adminUsername.equals(command.username()) || !adminPassword.equals(command.password())) {
            throw new ResponseStatusException(UNAUTHORIZED, "Invalid administrator credentials.");
        }

        String token = sessionRepository.create(command.username());
        return new AdminSessionResult(token, adminName, "ADMIN", hotelRepository.listHotels());
    }
}
