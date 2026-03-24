package com.aluon.erp.budget;

import com.aluon.crm.quote.QuoteStatus;
import lombok.Data;

@Data
public class ErpBudgetSyncRequest {
    private String quoteNumber;
    private QuoteStatus status;
}
