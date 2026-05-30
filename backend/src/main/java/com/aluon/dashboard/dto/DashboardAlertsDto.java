package com.aluon.dashboard.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record DashboardAlertsDto(
        List<DashboardAlertDto> alerts,
        OffsetDateTime updatedAt
) {
}

