package com.aluon.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.aluon.dashboard.dto.DashboardAlertsDto;
import com.aluon.dashboard.dto.DashboardKpisDto;
import com.aluon.dashboard.dto.DashboardOperationsDto;
import com.aluon.dashboard.api.DashboardFinanceResponse;
import com.aluon.dashboard.api.DashboardRange;
import com.aluon.dashboard.api.DashboardWorkflowResponse;
import com.aluon.dashboard.service.DashboardFinanceService;
import com.aluon.dashboard.service.DashboardService;
import com.aluon.dashboard.service.DashboardWorkflowService;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final DashboardFinanceService dashboardFinanceService;
    private final DashboardWorkflowService dashboardWorkflowService;

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

    @GetMapping("/finance")
    public ResponseEntity<DashboardFinanceResponse> getFinance(
            @RequestParam(name = "range", required = false) String range) {
        return ResponseEntity.ok(dashboardFinanceService.getFinance(DashboardRange.from(range)));
    }

    @GetMapping("/workflow")
    public ResponseEntity<DashboardWorkflowResponse> getWorkflow(
            @RequestParam(name = "range", required = false) String range) {
        return ResponseEntity.ok(dashboardWorkflowService.getWorkflow(DashboardRange.from(range)));
    }
}
