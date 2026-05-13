package br.com.fiap.flexcheck.admin.infrastructure.repository;

import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Repository
public class InMemoryAuditRepository {
    private final List<AuditEvent> events = new CopyOnWriteArrayList<>();

    public void record(AuditEvent event) {
        events.add(event);
    }

    public List<AuditEvent> recent() {
        int fromIndex = Math.max(0, events.size() - 8);
        return List.copyOf(events.subList(fromIndex, events.size()));
    }

    public long countByAction(String action) {
        return events.stream()
                .filter(event -> action.equalsIgnoreCase(event.action()))
                .count();
    }

    public long countByResult(String result) {
        return events.stream()
                .filter(event -> result.equalsIgnoreCase(event.result()))
                .count();
    }
}
