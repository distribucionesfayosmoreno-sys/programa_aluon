package com.aluon.production.budget;

import com.aluon.core.user.Role;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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
    private UUID approvedByUserId;
    private String approvedByUsername;
    private Role approvedByRole;
}
