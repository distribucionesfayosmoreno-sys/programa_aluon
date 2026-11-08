package com.aluon.crm.catalog.porton;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class PortonConfigurationConverter implements AttributeConverter<PortonConfiguration, String> {
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(PortonConfiguration value) {
        if (value == null) return null;
        try {
            return MAPPER.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("No se pudo guardar la configuración del portón", ex);
        }
    }

    @Override
    public PortonConfiguration convertToEntityAttribute(String value) {
        if (value == null) return null;
        try {
            return MAPPER.readValue(value, PortonConfiguration.class);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Configuración de portón almacenada inválida", ex);
        }
    }
}
