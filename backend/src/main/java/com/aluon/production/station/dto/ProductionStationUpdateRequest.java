package com.aluon.production.station.dto;

import com.aluon.production.station.model.ProductionStationStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Request para avanzar (iniciar/completar) una estación.
 */
public record ProductionStationUpdateRequest(
    @NotNull ProductionStationStatus status,
    Long operatorUserId,
    String operatorName,
    String notes
) {}
