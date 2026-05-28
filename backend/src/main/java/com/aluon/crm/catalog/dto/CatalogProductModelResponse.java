package com.aluon.crm.catalog.dto;

import com.aluon.production.cutlist.model.DoorModel;

import java.util.UUID;

public record CatalogProductModelResponse(
        UUID id,
        DoorModel modelo,
        String imagenModelo
) {
}

