package com.aluon.production.budget;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class BudgetValidationApprovalRequest {
    private UUID userId;
}
