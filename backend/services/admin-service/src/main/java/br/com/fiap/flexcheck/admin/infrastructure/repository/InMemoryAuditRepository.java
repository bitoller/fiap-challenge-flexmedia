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

    public List<AuditEvent> recent(Long hotelId) {
        List<AuditEvent> filtered = filtered(hotelId);
        return filtered.stream()
                .skip(Math.max(0, filtered.size() - 8L))
                .toList();
    }

    public long countByAction(Long hotelId, String action) {
        return filtered(hotelId).stream()
                .filter(event -> action.equalsIgnoreCase(event.action()))
                .count();
    }

    public long countByResult(Long hotelId, String result) {
        return filtered(hotelId).stream()
                .filter(event -> result.equalsIgnoreCase(event.result()))
                .count();
    }

    private List<AuditEvent> filtered(Long hotelId) {
        return events.stream()
                .filter(event -> hotelId == null || hotelId.equals(event.hotelId()))
                .toList();
    }
}
