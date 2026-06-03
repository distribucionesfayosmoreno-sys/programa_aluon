package com.aluon.crm.catalog.dto;

import java.util.UUID;

public record CatalogFamilyResponse(
        UUID id,
        String technicalModel,
        String name,
        String description,
        String imageUrl
) {
}
