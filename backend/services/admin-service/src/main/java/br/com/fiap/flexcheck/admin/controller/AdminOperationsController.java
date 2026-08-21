package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.infrastructure.client.DeviceServiceClient;
import br.com.fiap.flexcheck.admin.infrastructure.persistence.OracleAuditRepository;
import br.com.fiap.flexcheck.admin.service.result.DeviceStatusResult;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminOperationsController {
    private final DeviceServiceClient deviceServiceClient;
    private final OracleAuditRepository auditRepository;

    public AdminOperationsController(DeviceServiceClient deviceServiceClient, OracleAuditRepository auditRepository) {
        this.deviceServiceClient = deviceServiceClient;
        this.auditRepository = auditRepository;
    }

    @GetMapping("/devices")
    public DeviceStatusResult devices(@RequestParam(required = false) Long hotelId) {
        return deviceServiceClient.status(hotelId);
    }

    @GetMapping("/audit")
    public List<AuditEvent> audit(@RequestParam(required = false) Long hotelId) {
        return auditRepository.recent(hotelId);
    }

    @PostMapping("/hotels/{hotelId}/support-requests/acknowledge")
    public SupportRequestAcknowledgement acknowledgeSupportRequests(@PathVariable long hotelId) {
        return new SupportRequestAcknowledgement(auditRepository.acknowledgeOpenSupportRequests(hotelId));
    }

    public record SupportRequestAcknowledgement(int acknowledgedCount) {
    }
}
