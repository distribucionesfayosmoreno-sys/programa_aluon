package com.aluon.crm.doorsimulation.dto;

import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJobStatus;

import java.util.UUID;

public record CreateDoorSimulationResponse(
        UUID jobId,
        DoorVisualSimulationJobStatus status,
        String baseImageUrl,
        int imageWidth,
        int imageHeight
) {
}

