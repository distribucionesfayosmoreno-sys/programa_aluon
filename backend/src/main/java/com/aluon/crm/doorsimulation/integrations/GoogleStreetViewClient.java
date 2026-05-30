package com.aluon.crm.doorsimulation.integrations;

import com.aluon.crm.doorsimulation.config.DoorSimulationGoogleProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

@Component
@RequiredArgsConstructor
public class GoogleStreetViewClient {

    private final DoorSimulationGoogleProperties props;
    private final RestClient doorSimulationRestClient;

    public byte[] fetchStreetViewImage(String address, String size, int fov, Double heading, Double pitch) {
        assertEnabledAndConfigured();
        if (!StringUtils.hasText(address)) throw new IllegalArgumentException("address es obligatorio");
        String finalSize = StringUtils.hasText(size) ? size : props.defaultImageSize();

        String uri = UriComponentsBuilder
                .fromUriString(baseUrl())
                .path("/maps/api/streetview")
                .queryParam("size", finalSize)
                .queryParam("location", address)
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

    private String baseUrl() {
        if (StringUtils.hasText(props.baseUrl())) return props.baseUrl().replaceAll("/+$", "");
        return "https://maps.googleapis.com";
    }

    private void assertEnabledAndConfigured() {
        if (!props.enabled()) throw new IllegalArgumentException("Google Street View deshabilitado");
        if (!StringUtils.hasText(props.apiKey())) throw new IllegalArgumentException("Google Street View no configurado: falta apiKey");
    }
}

