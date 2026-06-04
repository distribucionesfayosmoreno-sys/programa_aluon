package com.aluon.crm.documents.dto;

import jakarta.validation.constraints.NotBlank;

public record DocumentManagementCreateRequest(
        @NotBlank String customerName,
        @NotBlank String type,
        @NotBlank String number
) {
}
