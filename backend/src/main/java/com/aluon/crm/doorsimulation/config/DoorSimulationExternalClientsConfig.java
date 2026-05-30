package com.aluon.crm.doorsimulation.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
@EnableConfigurationProperties({
        DoorSimulationGoogleProperties.class,
        DoorSimulationStabilityProperties.class,
        ObjectStorageProperties.class
})
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class DoorSimulationExternalClientsConfig {

    @Bean
    RestClient doorSimulationRestClient(RestClient.Builder builder) {
        SimpleClientHttpRequestFactory rf = new SimpleClientHttpRequestFactory();
        rf.setConnectTimeout(Duration.ofSeconds(10));
        rf.setReadTimeout(Duration.ofSeconds(60));
        return builder
                .requestFactory(rf)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
