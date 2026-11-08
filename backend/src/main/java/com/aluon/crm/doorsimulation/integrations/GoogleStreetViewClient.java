package com.aluon.crm.doorsimulation.integrations;

import com.aluon.crm.doorsimulation.config.DoorSimulationGoogleProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;
import com.fasterxml.jackson.databind.JsonNode;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "integrations.door-simulation.google-street-view", name = "enabled", havingValue = "true")
public class GoogleStreetViewClient {

    private final DoorSimulationGoogleProperties props;
    private final RestClient doorSimulationRestClient;

    public byte[] fetchStreetViewImage(String location, String size, int fov, Double heading, Double pitch) {
        assertEnabledAndConfigured();
        if (!StringUtils.hasText(location)) throw new IllegalArgumentException("location es obligatorio");
        String finalSize = StringUtils.hasText(size) ? size : props.defaultImageSize();

        String uri = UriComponentsBuilder
                .fromUriString(baseUrl())
                .path("/maps/api/streetview")
                .queryParam("size", finalSize)
                .queryParam("location", location)
                .queryParam("fov", fov)
                .queryParam("return_error_code", "true")
                .queryParamIfPresent("heading", heading == null ? java.util.Optional.empty() : java.util.Optional.of(heading))
                .queryParamIfPresent("pitch", pitch == null ? java.util.Optional.empty() : java.util.Optional.of(pitch))
                .queryParam("key", props.apiKey())
                .build()
                .toUriString();

        try {
            return doorSimulationRestClient
                    .get()
                    .uri(uri)
                    .accept(MediaType.IMAGE_JPEG, MediaType.IMAGE_PNG, MediaType.ALL)
                    .retrieve()
                    .body(byte[].class);
        } catch (RestClientResponseException ex) {
            throw ex;
        }
    }

    public GeocodedLocation geocode(String address) {
        assertEnabledAndConfigured();
        if (!StringUtils.hasText(address)) throw new IllegalArgumentException("address es obligatorio");

        String uri = UriComponentsBuilder
                .fromUriString(baseUrl())
                .path("/maps/api/geocode/json")
                .queryParam("address", address)
                .queryParam("key", props.apiKey())
                .build()
                .toUriString();

        JsonNode response = doorSimulationRestClient.get().uri(uri).retrieve().body(JsonNode.class);
        if (response == null || !"OK".equals(response.path("status").asText()) || !response.path("results").elements().hasNext()) {
            throw new IllegalArgumentException("No se pudo localizar la dirección");
        }
        JsonNode location = response.path("results").get(0).path("geometry").path("location");
        return new GeocodedLocation(location.path("lat").asDouble(), location.path("lng").asDouble());
    }

    public record GeocodedLocation(double latitude, double longitude) {
    }

    private String baseUrl() {
        if (StringUtils.hasText(props.baseUrl())) return props.baseUrl().replaceAll("/+$", "");
        return "https://maps.googleapis.com";
    }

    private void assertEnabledAndConfigured() {
        if (!props.enabled()) throw new IllegalArgumentException("Google Street View deshabilitado");
        if (!StringUtils.hasText(props.apiKey())) throw new IllegalArgumentException("Google Street View no configurado: falta apiKey");
    }
}
