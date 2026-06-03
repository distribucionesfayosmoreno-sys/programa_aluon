package com.aluon.crm.catalog.dto;

import java.util.List;
import java.util.UUID;

public record CatalogAdminFamilyResponse(
        UUID id,
        String technicalModel,
        String name,
        String description,
        String imageUrl,
        Integer sortOrder,
        Boolean active,
        List<CatalogAdminChildResponse> children
) {
}
