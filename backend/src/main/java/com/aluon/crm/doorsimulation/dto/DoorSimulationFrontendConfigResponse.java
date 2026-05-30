package com.aluon.crm.doorsimulation.dto;

public record DoorSimulationFrontendConfigResponse(
        boolean enabled,
        String mapsJavaScriptApiKey
) {
}
