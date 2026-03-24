package com.aluon.erp.budget;

import com.aluon.crm.quote.QuoteStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDateTime;

@Value
@Builder
public class ErpBudgetStatusResponse {
    String quoteNumber;
    QuoteStatus status;
    LocalDateTime createdAt;
    LocalDateTime validatedAt;
    LocalDateTime sentAt;
}
