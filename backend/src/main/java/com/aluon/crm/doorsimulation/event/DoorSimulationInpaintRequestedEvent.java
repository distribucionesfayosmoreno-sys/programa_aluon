package com.aluon.crm.doorsimulation.event;

import java.util.UUID;

public record DoorSimulationInpaintRequestedEvent(
        UUID jobId,
        String prompt,
        String negativePrompt
) {
}

