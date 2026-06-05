package com.aluon.production.station.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request para bloquear una estación por incidencia.
 */
public record ProductionStationBlockRequest(
    @NotBlank String reason
) {}
