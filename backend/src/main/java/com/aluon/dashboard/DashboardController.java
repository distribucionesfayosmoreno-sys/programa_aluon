package com.aluon.dashboard;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
