package com.aluon.crm.quote.render;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "aluon.quote.template")
public record QuoteTemplateProperties(
        String accentColor,
        String brandName,
        String tagline,
        BigDecimal vatRate
) {
    public QuoteTemplateProperties {
        if (accentColor == null || accentColor.isBlank()) accentColor = "#2563eb";
        if (brandName == null || brandName.isBlank()) brandName = "ALUON";
        if (tagline == null || tagline.isBlank()) tagline = "CERRAJERÍA";
        if (vatRate == null) vatRate = BigDecimal.ZERO;
    }
}

