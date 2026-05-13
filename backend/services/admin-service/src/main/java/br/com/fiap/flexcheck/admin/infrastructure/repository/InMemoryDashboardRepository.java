package br.com.fiap.flexcheck.admin.infrastructure.repository;

import br.com.fiap.flexcheck.admin.service.result.DashboardResult;
import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class InMemoryDashboardRepository {
    private final InMemoryAuditRepository auditRepository;

    public InMemoryDashboardRepository(InMemoryAuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public DashboardResult dashboard(Long hotelId, DeviceStatusResult deviceStatus) {
        long completedCheckins = auditRepository.countByAction(hotelId, "CHECKIN_COMPLETED");
        long completedCheckouts = auditRepository.countByAction(hotelId, "CHECKOUT_COMPLETED");
        long failedSessions = auditRepository.countByResult(hotelId, "FAILURE");
        long activeStays = Math.max(0, completedCheckins - completedCheckouts);
        long reservationsToday = completedCheckins;
        List<Map<String, Object>> recent = auditRepository.recent(hotelId).stream()
                .map(event -> {
                    java.util.Map<String, Object> item = new java.util.HashMap<>();
                    if (event.hotelId() != null) {
                        item.put("hotelId", event.hotelId());
                    }
                    item.put("actorType", event.actorType());
                    item.put("actorId", event.actorId());
                    item.put("action", event.action());
                    item.put("resourceType", event.resourceType());
                    item.put("resourceId", event.resourceId());
                    item.put("result", event.result());
                    item.put("correlationId", event.correlationId());
                    return java.util.Map.copyOf(item);
                })
                .toList();

        var dashboard = new br.com.fiap.flexcheck.admin.domain.entity.Dashboard(
                reservationsToday,
                activeStays,
                completedCheckins,
                completedCheckouts,
                failedSessions,
                new br.com.fiap.flexcheck.admin.domain.entity.Dashboard.DeviceStatus(
                        deviceStatus.totalDevices(),
                        deviceStatus.onlineDevices(),
                        deviceStatus.offlineDevices(),
                        deviceStatus.maintenanceDevices(),
                        deviceStatus.errorDevices(),
                        deviceStatus.devices()
                ),
                recent
        );
        return new DashboardResult(
                hotelId,
                dashboard.reservationsToday(),
                dashboard.activeStays(),
                dashboard.completedCheckins(),
                dashboard.completedCheckouts(),
                dashboard.failedSessions(),
                new DeviceStatusResult(
                        dashboard.deviceStatus().totalDevices(),
                        dashboard.deviceStatus().onlineDevices(),
                        dashboard.deviceStatus().offlineDevices(),
                        dashboard.deviceStatus().maintenanceDevices(),
                        dashboard.deviceStatus().errorDevices(),
                        dashboard.deviceStatus().devices()
                ),
                dashboard.recentSessions()
        );
    }
}
