package com.aluon.crm.catalog.dto;

import com.aluon.crm.catalog.model.ProductCategory;

import java.util.UUID;

public record CatalogDoorProductResponse(
        UUID id,
        UUID modeloId,
        ProductCategory producto,
        String imagenModelo
) {
}

