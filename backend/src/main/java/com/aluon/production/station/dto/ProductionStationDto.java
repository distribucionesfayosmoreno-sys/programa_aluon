package com.aluon.production.station.dto;

import com.aluon.production.station.model.ProductionStationCode;
import com.aluon.production.station.model.ProductionStationStatus;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de lectura para una estación de producción.
 */
public record ProductionStationDto(
    UUID id,
    ProductionStationCode stationCode,
    String stationLabel,
    int sequenceOrder,
    ProductionStationStatus status,
    Long operatorUserId,
    String operatorName,
    LocalDateTime startedAt,
    LocalDateTime completedAt,
    String blockReason,
    LocalDateTime blockedAt,
    LocalDateTime unblockedAt,
    String notes
) {}
