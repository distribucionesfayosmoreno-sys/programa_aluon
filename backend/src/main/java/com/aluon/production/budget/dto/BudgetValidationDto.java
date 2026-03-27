package com.aluon.production.budget.dto;

import com.aluon.core.user.model.Role;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import com.aluon.production.budget.model.BudgetValidationStatus;

@Data
@Builder
public class BudgetValidationDto {
    private UUID id;
    private String budgetNumber;
    private String requestId;
    private String customerName;
    private String modelLabel;
    private BigDecimal m2;
    private BigDecimal total;
    private BudgetValidationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private Long approvedByUserId;
    private String approvedByUsername;
    private Role approvedByRole;
}
