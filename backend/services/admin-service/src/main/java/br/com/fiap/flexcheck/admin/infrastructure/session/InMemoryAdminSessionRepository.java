package br.com.fiap.flexcheck.admin.infrastructure.session;

import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class InMemoryAdminSessionRepository {
    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public String create(String username) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, username);
        return token;
    }

    public boolean isValid(String token) {
        return token != null && sessions.containsKey(token);
    }
}
