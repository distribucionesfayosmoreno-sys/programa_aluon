package com.aluon.crm.quote.dto;

import jakarta.validation.constraints.NotBlank;

public record QuoteDocumentCreateRequest(
        @NotBlank String tipo
) {}

