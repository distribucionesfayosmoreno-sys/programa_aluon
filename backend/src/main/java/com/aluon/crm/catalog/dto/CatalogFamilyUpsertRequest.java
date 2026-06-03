package com.aluon.crm.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CatalogFamilyUpsertRequest(
        @NotBlank @Size(max = 120) String technicalModel,
        @NotBlank @Size(max = 120) String name,
        @Size(max = 5000) String description,
        @Size(max = 1_000_000) String imageUrl,
        @NotNull Integer sortOrder,
        @NotNull Boolean active
) {
}
