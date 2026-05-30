package com.aluon.crm.doorsimulation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "integrations.door-simulation.google-street-view")
public record DoorSimulationGoogleProperties(
        boolean enabled,
        String apiKey,
        String browserApiKey,
        String baseUrl,
        String defaultImageSize,
        int defaultFov
) {
}
