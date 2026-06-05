package com.aluon.crm.documents.dto;

import jakarta.validation.constraints.NotBlank;

public record ManualDocumentUpdateRequest(
        @NotBlank String customerName,
        @NotBlank String type,
        @NotBlank String number
) {
}
