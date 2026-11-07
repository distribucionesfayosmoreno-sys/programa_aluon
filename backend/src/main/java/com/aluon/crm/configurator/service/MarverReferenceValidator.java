package com.aluon.crm.configurator.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.core.io.ClassPathResource;
import java.io.IOException;
import java.util.Set;

/** Captured supplier options require technical review; they are not ALUON engineering rules. */
public final class MarverReferenceValidator {
    private static final Set<String> STATUSES = Set.of("DRAFT", "PENDING_REVIEW", "CANCELLED");
    private MarverReferenceValidator() {}
    private static final class CatalogHolder {
        private static final JsonNode CATALOG = load();
        private static JsonNode load() {
            try (var input = new ClassPathResource("catalog/marver-reference.json").getInputStream()) {
                return new ObjectMapper().readTree(input);
            } catch (IOException error) { throw new IllegalStateException("No se pudo leer el catálogo Marver.", error); }
        }
    }
    public static void validate(JsonNode payload, String productType, String status) {
        JsonNode spec = payload.path("referenceSpecification");
        boolean reference = "REFERENCIA_MARVER".equalsIgnoreCase(productType);
        if (!reference && (spec.isMissingNode() || spec.isNull())) return;
        require(reference, "La ficha Marver requiere una configuración de referencia.");
        require(STATUSES.contains(status), "La referencia Marver requiere revisión técnica y valoración antes de confirmar o fabricar.");
        require(spec.isObject() && spec.path("catalogVersion").asInt() == 1, "Ficha Marver no válida.");
        JsonNode form = find(CatalogHolder.CATALOG.path("forms"), "id", spec.path("formId").asText());
        require(form != null, "Plantilla Marver desconocida.");
        String modelId = spec.path("modelId").asText();
        JsonNode model = find(form.path("models"), "id", modelId);
        require(modelId.isBlank() || model != null, "Modelo no disponible para esta plantilla Marver.");
        require(!"PENDING_REVIEW".equals(status) || form.path("models").isEmpty() || model != null, "Selecciona un modelo de referencia.");
        JsonNode values = spec.path("values");
        require(values.isObject(), "Las respuestas Marver deben ser un objeto.");
        var answers = new ObjectMapper().createArrayNode();
        var entries = values.fields();
        while (entries.hasNext()) {
            var entry = entries.next();
            JsonNode field = find(form.path("fields"), "id", entry.getKey());
            require(field != null, "Campo Marver desconocido: " + entry.getKey());
            JsonNode value = entry.getValue();
            require(value.isValueNode() && !value.isNull(), "Respuesta Marver no válida.");
            if (value.isTextual() && value.asText().isEmpty()) continue;
            String type = field.path("type").asText();
            if ("number".equals(type)) {
                require(value.isNumber() && Double.isFinite(value.asDouble()), "La medida debe ser numérica: " + field.path("label").asText());
                require(field.path("min").isNull() || value.asDouble() >= field.path("min").asDouble(), "Valor inferior al rango de captura: " + field.path("label").asText());
                require(field.path("max").isNull() || value.asDouble() <= field.path("max").asDouble(), "Valor superior al rango de captura: " + field.path("label").asText());
            } else if ("checkbox".equals(type)) require(value.isBoolean(), "La casilla Marver debe ser booleana.");
            else require(value.isTextual() && value.asText().length() <= 10000, "Texto Marver no válido.");
            JsonNode option = find(field.path("options"), "value", value.asText());
            require(field.path("options").isEmpty() || option != null, "Opción no disponible: " + field.path("label").asText());
            String display = option != null ? option.path("label").asText() : value.isBoolean() ? value.asBoolean() ? "Sí" : "No" : value.asText();
            answers.addObject().put("fieldId", entry.getKey()).put("label", field.path("label").asText()).put("value", display);
        }
        ObjectNode canonical = (ObjectNode) spec;
        canonical.put("formName", form.path("name").asText());
        canonical.put("modelName", model == null ? "" : model.path("name").asText());
        canonical.set("answers", answers);
    }
    private static JsonNode find(JsonNode items, String key, String value) {
        for (JsonNode item : items) if (item.path(key).asText().equals(value)) return item;
        return null;
    }
    private static void require(boolean condition, String message) { if (!condition) throw new IllegalArgumentException(message); }
}
