package com.aluon.crm.doorsimulation.integrations;

import com.aluon.crm.doorsimulation.config.DoorSimulationStabilityProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
@RequiredArgsConstructor
public class StabilityInpaintingClient {

    private final DoorSimulationStabilityProperties props;
    private final RestClient doorSimulationRestClient;

    public byte[] inpaint(byte[] imageBytes, byte[] maskBytes, String prompt, String negativePrompt) {
        assertEnabledAndConfigured();
        if (imageBytes == null || imageBytes.length == 0) throw new IllegalArgumentException("image es obligatorio");
        if (maskBytes == null || maskBytes.length == 0) throw new IllegalArgumentException("mask es obligatoria");

        String finalPrompt = StringUtils.hasText(prompt) ? prompt : props.defaultPrompt();
        if (!StringUtils.hasText(finalPrompt)) throw new IllegalArgumentException("prompt es obligatorio");

        var imageRes = new NamedByteArrayResource(imageBytes, "image.png");
        var maskRes = new NamedByteArrayResource(maskBytes, "mask.png");

        var form = new LinkedMultiValueMap<String, Object>();
        form.add("image", imageRes);
        form.add("mask", maskRes);
        form.add("prompt", finalPrompt);
        if (StringUtils.hasText(negativePrompt)) form.add("negative_prompt", negativePrompt);
        if (StringUtils.hasText(props.outputFormat())) form.add("output_format", props.outputFormat());

        String uri = baseUrl() + inpaintPath();

        try {
            return doorSimulationRestClient
                    .post()
                    .uri(uri)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + props.apiKey())
                    .accept(MediaType.IMAGE_PNG, MediaType.IMAGE_JPEG, MediaType.ALL)
                    .body(form)
                    .retrieve()
                    .body(byte[].class);
        } catch (RestClientResponseException ex) {
            throw ex;
        }
    }

    private String baseUrl() {
        if (StringUtils.hasText(props.baseUrl())) return props.baseUrl().replaceAll("/+$", "");
        return "https://api.stability.ai";
    }

    private String inpaintPath() {
        if (StringUtils.hasText(props.inpaintPath())) return props.inpaintPath().startsWith("/") ? props.inpaintPath() : "/" + props.inpaintPath();
        return "/v2beta/stable-image/edit/inpaint";
    }

    private void assertEnabledAndConfigured() {
        if (!props.enabled()) throw new IllegalArgumentException("Stability AI deshabilitado");
        if (!StringUtils.hasText(props.apiKey())) throw new IllegalArgumentException("Stability AI no configurado: falta apiKey");
    }

    private static final class NamedByteArrayResource extends ByteArrayResource {
        private final String filename;

        private NamedByteArrayResource(byte[] bytes, String filename) {
            super(bytes);
            this.filename = filename;
        }

        @Override
        public String getFilename() {
            return filename;
        }
    }
}

