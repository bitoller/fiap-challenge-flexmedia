package br.com.fiap.flexcheck.checkin.controller;

import br.com.fiap.flexcheck.checkin.dto.DashboardResponse;
import br.com.fiap.flexcheck.checkin.mapper.ApiMapper;
import br.com.fiap.flexcheck.checkin.service.DashboardUseCase;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminDashboardController {
    private final DashboardUseCase dashboardUseCase;

    public AdminDashboardController(DashboardUseCase dashboardUseCase) {
        this.dashboardUseCase = dashboardUseCase;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return ApiMapper.toResponse(dashboardUseCase.execute());
    }
}
