package com.aluon.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class DashboardKpisDto {
    private long ordersToPrepare;
    private long monthlyBilling;
    private long criticalStockAlerts;
    private long crmTasksToday;
    private OffsetDateTime updatedAt;
}
