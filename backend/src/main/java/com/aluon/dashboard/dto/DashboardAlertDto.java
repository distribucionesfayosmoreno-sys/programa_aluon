package com.aluon.dashboard.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardAlertDto {
    private String title;
    private String detail;
    private String tone;
}
