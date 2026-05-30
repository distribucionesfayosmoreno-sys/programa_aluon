package com.aluon.crm.doorsimulation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "integrations.door-simulation.stability")
public record DoorSimulationStabilityProperties(
        boolean enabled,
        String apiKey,
        String baseUrl,
        String inpaintPath,
        String defaultPrompt,
        String defaultNegativePrompt,
        String outputFormat
) {
}

