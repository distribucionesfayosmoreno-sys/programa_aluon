package com.aluon.crm.doorsimulation.dto;

import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJobStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record DoorSimulationStatusResponse(
        UUID jobId,
        DoorVisualSimulationJobStatus status,
        String baseImageUrl,
        String resultImageUrl,
        String errorMessage,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}

