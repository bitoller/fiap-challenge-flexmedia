package br.com.fiap.flexcheck.checkin.service.identity;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class IdentityDocumentImageStore {
    private final Map<Long, String> documentImages = new ConcurrentHashMap<>();

    public void put(Long sessionId, String imageBase64) {
        documentImages.put(sessionId, imageBase64);
    }

    public Optional<String> get(Long sessionId) {
        return Optional.ofNullable(documentImages.get(sessionId));
    }

    public void remove(Long sessionId) {
        documentImages.remove(sessionId);
    }
}
