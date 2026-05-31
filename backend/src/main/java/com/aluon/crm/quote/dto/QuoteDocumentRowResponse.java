package com.aluon.crm.quote.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record QuoteDocumentRowResponse(
        UUID id,
        String tipo,
        String numeroDocumento,
        LocalDateTime createdAt
) {}

