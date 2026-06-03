package com.aluon.crm.catalog.dto;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public record CatalogChildUpsertRequest(
        @NotNull UUID familyId,
        @NotNull ProductCategory productCategory,
        @NotNull DoorType doorType,
        @NotBlank @Size(max = 120) String name,
        @Size(max = 5000) String description,
        @Size(max = 1_000_000) String imageUrl,
        @NotNull Integer sortOrder,
        @NotNull Boolean active
) {
}
