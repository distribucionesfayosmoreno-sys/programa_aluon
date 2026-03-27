package com.aluon.erp.budget.dto;

import com.aluon.crm.quote.model.QuoteStatus;
import lombok.Data;

@Data
public class ErpBudgetSyncRequest {
    private String quoteNumber;
    private QuoteStatus status;
}
