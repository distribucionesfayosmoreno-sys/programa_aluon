package com.aluon.crm.catalog.dto;

import java.util.UUID;

public record CatalogProductModelResponse(
        UUID id,
        String modelo,
        String imagenModelo
) {
}
