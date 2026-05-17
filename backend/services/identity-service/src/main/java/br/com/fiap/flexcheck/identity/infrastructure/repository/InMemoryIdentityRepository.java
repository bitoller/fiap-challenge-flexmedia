package br.com.fiap.flexcheck.identity.infrastructure.repository;

import br.com.fiap.flexcheck.identity.application.command.CreateKioskCredentialCommand;
import br.com.fiap.flexcheck.identity.application.command.LoginCommand;
import br.com.fiap.flexcheck.identity.application.command.RefreshTokenCommand;
import br.com.fiap.flexcheck.identity.domain.entity.KioskCredential;
import br.com.fiap.flexcheck.identity.domain.entity.UserAccount;
import br.com.fiap.flexcheck.identity.infrastructure.security.PasswordHasher;
import br.com.fiap.flexcheck.identity.service.result.AuthSessionResult;
import br.com.fiap.flexcheck.identity.service.result.KioskCredentialResult;
import br.com.fiap.flexcheck.identity.service.result.UserProfileResult;
import br.com.fiap.flexcheck.identity.service.result.UserSummaryResult;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

@Repository
public class InMemoryIdentityRepository {
    private final AtomicLong userSequence = new AtomicLong(1L);
    private final AtomicLong kioskSequence = new AtomicLong(1L);
    private final ConcurrentMap<Long, UserAccount> users = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, SessionRecord> sessions = new ConcurrentHashMap<>();
    private final ConcurrentMap<String, SessionRecord> refreshTokens = new ConcurrentHashMap<>();
    private final ConcurrentMap<Long, KioskCredential> kioskCredentials = new ConcurrentHashMap<>();

    public InMemoryIdentityRepository() {
        LocalDateTime now = LocalDateTime.now();
        seedUser("Hotel Owner", "owner@flexcheck.local", "Welcome123!", List.of("ADMIN", "MANAGER"), now);
        seedUser("Reception Desk", "reception@flexcheck.local", "Welcome123!", List.of("RECEPTIONIST"), now);
        seedUser("Audit Reader", "audit@flexcheck.local", "Welcome123!", List.of("AUDITOR"), now);
    }

    public AuthSessionResult login(LoginCommand command) {
        UserAccount user = users.values().stream()
                .filter(candidate -> candidate.username().equalsIgnoreCase(command.username()))
                .findFirst()
                .filter(candidate -> PasswordHasher.matches(command.password(), candidate.passwordHash()))
                .orElseThrow(() -> new IdentityException("INVALID_CREDENTIALS", "Credenciais invalidas.", 401));
        return createSession(user);
    }

    public AuthSessionResult refresh(RefreshTokenCommand command) {
        SessionRecord record = refreshTokens.get(command.refreshToken());
        if (record == null || record.refreshExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IdentityException("REFRESH_TOKEN_INVALID", "Refresh token invalido ou expirado.", 401);
        }
        UserAccount user = users.get(record.userId());
        if (user == null || !user.active()) {
            throw new IdentityException("USER_INACTIVE", "User is inactive.", 403);
        }
        return createSession(user);
    }

    public UserProfileResult currentUser(String accessToken) {
        SessionRecord record = sessions.get(accessToken);
        if (record == null || record.expiresAt().isBefore(LocalDateTime.now())) {
            throw new IdentityException("TOKEN_INVALID", "Token invalido ou expirado.", 401);
        }
        UserAccount user = users.get(record.userId());
        if (user == null || !user.active()) {
            throw new IdentityException("USER_INACTIVE", "User is inactive.", 403);
        }
        return toProfile(user);
    }

    public List<UserSummaryResult> listUsers() {
        return users.values().stream()
                .map(this::toSummary)
                .sorted((left, right) -> left.id().compareTo(right.id()))
                .toList();
    }

    public KioskCredentialResult createKioskCredential(CreateKioskCredentialCommand command) {
        LocalDateTime now = LocalDateTime.now();
        Long id = kioskSequence.getAndIncrement();
        String accessToken = "KIOSK-" + UUID.randomUUID();
        KioskCredential credential = new KioskCredential(
                id,
                command.hotelId(),
                command.kioskCode(),
                command.kioskName(),
                accessToken,
                now,
                now.plusDays(30),
                true
        );
        kioskCredentials.put(id, credential);
        return toResult(credential);
    }

    public List<KioskCredentialResult> listKioskCredentials() {
        return kioskCredentials.values().stream()
                .map(this::toResult)
                .sorted((left, right) -> left.id().compareTo(right.id()))
                .toList();
    }

    private AuthSessionResult createSession(UserAccount user) {
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(8);
        String accessToken = "ACC-" + UUID.randomUUID();
        String refreshToken = "REF-" + UUID.randomUUID();
        SessionRecord sessionRecord = new SessionRecord(user.id(), expiresAt, refreshToken, LocalDateTime.now().plusDays(1));
        sessions.put(accessToken, sessionRecord);
        refreshTokens.put(refreshToken, sessionRecord);
        return new AuthSessionResult(accessToken, refreshToken, expiresAt, toProfile(user));
    }

    private UserSummaryResult toSummary(UserAccount user) {
        return new UserSummaryResult(user.id(), user.name(), user.username(), user.roles(), user.active());
    }

    private UserProfileResult toProfile(UserAccount user) {
        return new UserProfileResult(user.id(), user.name(), user.username(), user.roles(), user.active(), user.createdAt(), user.updatedAt());
    }

    private KioskCredentialResult toResult(KioskCredential credential) {
        return new KioskCredentialResult(
                credential.id(),
                credential.hotelId(),
                credential.kioskCode(),
                credential.kioskName(),
                credential.accessToken(),
                credential.issuedAt(),
                credential.expiresAt(),
                credential.active()
        );
    }

    private void seedUser(String name, String username, String password, List<String> roles, LocalDateTime now) {
        Long id = userSequence.getAndIncrement();
        users.put(id, new UserAccount(id, name, username, PasswordHasher.hash(password), roles, true, now, now));
    }

    private record SessionRecord(Long userId, LocalDateTime expiresAt, String refreshToken, LocalDateTime refreshExpiresAt) {
    }

    public static final class IdentityException extends RuntimeException {
        private final int status;

        public IdentityException(String code, String message, int status) {
            super(code + ": " + message);
            this.status = status;
        }

        public int status() {
            return status;
        }
    }
}
