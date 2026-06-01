package com.aluon.crm.documents.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record DocumentManagementRowResponse(
        String rowId,
        String projectId,
        UUID quoteId,
        String customerName,
        String type,
        String number,
        String statusLabel,
        LocalDateTime createdAt
) {
}

