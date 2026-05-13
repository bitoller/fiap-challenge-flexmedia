package br.com.fiap.flexcheck.admin.controller;

import br.com.fiap.flexcheck.admin.application.RecordAuditUseCase;
import br.com.fiap.flexcheck.admin.application.ShowDashboardUseCase;
import br.com.fiap.flexcheck.admin.domain.entity.AuditEvent;
import br.com.fiap.flexcheck.admin.service.result.DashboardResult;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {
    private final ShowDashboardUseCase showDashboardUseCase;
    private final RecordAuditUseCase recordAuditUseCase;

    public AdminController(ShowDashboardUseCase showDashboardUseCase, RecordAuditUseCase recordAuditUseCase) {
        this.showDashboardUseCase = showDashboardUseCase;
        this.recordAuditUseCase = recordAuditUseCase;
    }

    @GetMapping("/dashboard")
    public DashboardResult dashboard(@RequestParam(required = false) Long hotelId) {
        return showDashboardUseCase.execute(hotelId);
    }

    @PostMapping("/audit-events")
    public void recordAudit(@Valid @RequestBody AuditEvent event) {
        recordAuditUseCase.execute(event);
    }
}
