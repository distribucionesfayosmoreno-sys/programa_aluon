package com.aluon.crm.doorsimulation.dto;

import com.aluon.crm.doorsimulation.model.DoorVisualSimulationJobStatus;

import java.util.UUID;

public record StartInpaintResponse(
        UUID jobId,
        DoorVisualSimulationJobStatus status,
        int pollAfterMs
) {
}

