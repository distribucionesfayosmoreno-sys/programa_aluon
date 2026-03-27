package com.aluon.production.budget.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetValidationCreateRequest {
    private String budgetNumber;
    private String requestId;
    private String customerName;
    private String modelLabel;
    private BigDecimal m2;
    private BigDecimal total;
}
