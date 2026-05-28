package com.aluon.crm.catalog.dto;

import com.aluon.production.cutlist.model.DoorType;

import java.util.UUID;

public record CatalogProductVariantResponse(
        UUID id,
        UUID puertaId,
        DoorType variante,
        String imagenVariante
) {
}

