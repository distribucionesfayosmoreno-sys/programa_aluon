package com.aluon.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
@Builder
public class DashboardOperationsDto {
    private long inRoute;
    private long completed;
    private long avgTimeMinutes;
    private OffsetDateTime updatedAt;
}
