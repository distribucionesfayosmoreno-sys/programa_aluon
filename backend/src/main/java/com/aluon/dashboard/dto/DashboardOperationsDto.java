package com.aluon.dashboard.dto;

import java.time.OffsetDateTime;

public record DashboardOperationsDto(
        long inRoute,
        long completed,
        long avgTimeMinutes,
        OffsetDateTime updatedAt
) {
}

