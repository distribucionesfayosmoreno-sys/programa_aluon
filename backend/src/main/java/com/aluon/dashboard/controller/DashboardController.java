package com.aluon.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aluon.dashboard.dto.DashboardAlertsDto;
import com.aluon.dashboard.dto.DashboardKpisDto;
import com.aluon.dashboard.dto.DashboardOperationsDto;
import com.aluon.dashboard.service.DashboardService;


@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpis")
    public ResponseEntity<DashboardKpisDto> getKpis() {
        return ResponseEntity.ok(dashboardService.getKpis());
    }

    @GetMapping("/operations")
    public ResponseEntity<DashboardOperationsDto> getOperations() {
        return ResponseEntity.ok(dashboardService.getOperations());
    }

    @GetMapping("/alerts")
    public ResponseEntity<DashboardAlertsDto> getAlerts() {
        return ResponseEntity.ok(dashboardService.getAlerts());
    }
}
