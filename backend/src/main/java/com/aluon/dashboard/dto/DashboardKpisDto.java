package com.aluon.dashboard.dto;

import java.time.OffsetDateTime;

public record DashboardKpisDto(
        long ordersToPrepare,
        long monthlyBilling,
        long criticalStockAlerts,
        long crmTasksToday,
        OffsetDateTime updatedAt
) {
}

