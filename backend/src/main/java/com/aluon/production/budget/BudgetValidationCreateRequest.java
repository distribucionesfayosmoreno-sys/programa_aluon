package com.aluon.production.budget;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetValidationCreateRequest {
    private String budgetNumber;
    private String requestId;
    private String customerName;
    private String modelLabel;
    private BigDecimal m2;
    private BigDecimal total;
}
