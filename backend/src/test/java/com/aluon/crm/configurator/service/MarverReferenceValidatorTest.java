package com.aluon.crm.configurator.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;
import static org.assertj.core.api.Assertions.*;

class MarverReferenceValidatorTest {
    private final ObjectMapper mapper = new ObjectMapper();
    private ObjectNode payload(String formId, String modelId) {
        ObjectNode payload = mapper.createObjectNode();
        var spec = payload.putObject("referenceSpecification");
        spec.put("catalogVersion", 1).put("formId", formId).put("modelId", modelId).put("formName", "forged").put("modelName", "forged");
        spec.putObject("values");
        return payload;
    }
    @Test void acceptsAll25TemplatesAndBuildsCanonicalNames() throws Exception {
        try (var input = new ClassPathResource("catalog/marver-reference.json").getInputStream()) {
            var catalog = mapper.readTree(input);
            assertThat(catalog.path("forms").size()).isEqualTo(25);
            for (var form : catalog.path("forms")) {
                String model = form.path("models").isEmpty() ? "" : form.path("models").get(0).path("id").asText();
                var payload = payload(form.path("id").asText(), model);
                MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "PENDING_REVIEW");
                assertThat(payload.path("referenceSpecification").path("formName").asText()).isEqualTo(form.path("name").asText());
            }
        }
    }
    @Test void rejectsManufacturingStatusAndUnknownModelsOrFields() {
        var payload = payload("cancela-peatonal", "unica");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "CONFIRMED")).hasMessageContaining("revisión técnica");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "IN_PRODUCTION")).hasMessageContaining("revisión técnica");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(payload("cancela-peatonal", "invented"), "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("Modelo");
        ((ObjectNode) payload.path("referenceSpecification").path("values")).put("invented", 123);
        assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("Campo Marver desconocido");
    }
    @Test void validatesNumericCaptureLimitsAndSelectOptions() throws Exception {
        try (var input = new ClassPathResource("catalog/marver-reference.json").getInputStream()) {
            var catalog = mapper.readTree(input);
            JsonNode form = null;
            for (var item : catalog.path("forms")) if (item.path("id").asText().equals("cancela-peatonal")) form = item;
            assertThat(form).isNotNull();
            for (var field : form.path("fields")) {
                var payload = payload("cancela-peatonal", "unica");
                var values = (ObjectNode) payload.path("referenceSpecification").path("values");
                if (field.path("sourceKey").asText().equals("anchoLuces")) {
                    values.put(field.path("id").asText(), 9999);
                    assertThatCode(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "PENDING_REVIEW")).doesNotThrowAnyException();
                    values.put(field.path("id").asText(), 10000);
                    assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "PENDING_REVIEW")).hasMessageContaining("rango de captura");
                }
                if (field.path("sourceKey").asText().equals("jImprimacion")) {
                    values.put(field.path("id").asText(), "invented");
                    assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("Opción no disponible");
                }
            }
        }
    }
    @Test void leavesNativeConfigurationsUntouched() {
        var payload = mapper.createObjectNode().put("model", "CLASSIC");
        assertThatCode(() -> MarverReferenceValidator.validate(payload, "PUERTA_PEATONAL", "CONFIRMED")).doesNotThrowAnyException();
        assertThat(payload.has("referenceSpecification")).isFalse();
    }
    private ObjectNode videoPayload() {
        var payload = payload("cancela-peatonal", "unica");
        payload.put("presentation", "MARVER_VIDEO");
        var forms = payload.putArray("videoForms");
        forms.addObject().put("id", "first").set("specification", payload.path("referenceSpecification").deepCopy());
        forms.addObject().put("id", "second").set("specification", payload("corredera", "grinon").path("referenceSpecification"));
        return payload;
    }
    @Test void validatesAndCanonicalizesEveryVideoForm() {
        var payload = videoPayload();
        MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "PENDING_REVIEW");
        assertThat(payload.path("videoForms").get(0).path("specification").path("formName").asText()).isEqualTo("Cancela peatonal");
        assertThat(payload.path("videoForms").get(1).path("specification").path("formName").asText()).isEqualTo("Corredera");
        assertThat(payload.path("referenceSpecification")).isEqualTo(payload.path("videoForms").get(0).path("specification"));
    }
    @Test void rejectsInvalidSecondaryVideoAnswersAndModels() {
        var payload = videoPayload();
        ((ObjectNode) payload.path("videoForms").get(1).path("specification").path("values")).put("invented", 2);
        assertThatThrownBy(() -> MarverReferenceValidator.validate(payload, "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("Campo Marver desconocido");
        var missingModel = videoPayload();
        ((ObjectNode) missingModel.path("videoForms").get(1).path("specification")).put("modelId", "");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(missingModel, "REFERENCIA_MARVER", "PENDING_REVIEW")).hasMessageContaining("modelo de referencia");
        assertThatCode(() -> MarverReferenceValidator.validate(missingModel, "REFERENCIA_MARVER", "DRAFT")).doesNotThrowAnyException();
    }
    @Test void rejectsDuplicateOrEmptyVideoFormsAndUnreviewedConfirmation() {
        var duplicate = videoPayload();
        ((ObjectNode) duplicate.path("videoForms").get(1)).put("id", "first");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(duplicate, "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("duplicado");
        var empty = videoPayload(); empty.putArray("videoForms");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(empty, "REFERENCIA_MARVER", "DRAFT")).hasMessageContaining("entre 1 y 50");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(videoPayload(), "REFERENCIA_MARVER", "CONFIRMED")).hasMessageContaining("revisión técnica");
        assertThatThrownBy(() -> MarverReferenceValidator.validate(videoPayload(), "PUERTA_PEATONAL", "DRAFT")).hasMessageContaining("configuración de referencia");
    }

}
