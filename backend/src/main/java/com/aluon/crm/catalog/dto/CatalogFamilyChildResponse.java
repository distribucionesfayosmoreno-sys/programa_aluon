package com.aluon.crm.catalog.dto;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorType;

import java.util.UUID;

public record CatalogFamilyChildResponse(
        UUID id,
        UUID familyId,
        ProductCategory productCategory,
        DoorType doorType,
        String name,
        String description,
        String imageUrl
) {
}
