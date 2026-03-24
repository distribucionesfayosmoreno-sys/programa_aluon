package com.aluon.dashboard;

import lombok.Builder;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
@Builder
public class DashboardAlertsDto {
    private List<DashboardAlertDto> alerts;
    private OffsetDateTime updatedAt;
}
