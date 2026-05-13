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

    public DashboardResult dashboard(DeviceStatusResult deviceStatus) {
        long completedCheckins = auditRepository.countByAction("CHECKIN_COMPLETED");
        long completedCheckouts = auditRepository.countByAction("CHECKOUT_COMPLETED");
        long failedSessions = auditRepository.countByResult("FAILURE");
        long activeStays = Math.max(0, completedCheckins - completedCheckouts);
        long reservationsToday = completedCheckins;
        List<Map<String, Object>> recent = auditRepository.recent().stream()
                .map(event -> Map.<String, Object>of(
                        "actorType", event.actorType(),
                        "actorId", event.actorId(),
                        "action", event.action(),
                        "resourceType", event.resourceType(),
                        "resourceId", event.resourceId(),
                        "result", event.result(),
                        "correlationId", event.correlationId()
                ))
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
