package com.aluon.crm.quote.render;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;
import java.util.List;

@ConfigurationProperties(prefix = "aluon.quote.template")
public record QuoteTemplateProperties(
        String accentColor,
        String brandName,
        String tagline,
        BigDecimal vatRate,
        String companyLegalName,
        List<String> companyAddressLines,
        String companyPhone,
        String companyEmail,
        List<String> termsLines,
        String signatureLeftLabel,
        String signatureRightLabel
) {
    public QuoteTemplateProperties {
        if (accentColor == null || accentColor.isBlank()) accentColor = "#2563eb";
        if (brandName == null || brandName.isBlank()) brandName = "ALUON";
        if (tagline == null || tagline.isBlank()) tagline = "Somos Aluminio Soldado";
        if (vatRate == null) vatRate = BigDecimal.ZERO;
        if (companyLegalName == null || companyLegalName.isBlank()) companyLegalName = "ALUMINIO SOLDADO, S.L.";
        if (companyAddressLines == null || companyAddressLines.isEmpty()) {
            companyAddressLines = List.of(
                    "TELF. 925 55 40 14",
                    "CTRA. 4.004 KM. 29,200",
                    "45290 PANTOJA (TOLEDO)",
                    "info@aluon.es"
            );
        }
        if (companyPhone == null) companyPhone = "";
        if (companyEmail == null) companyEmail = "";
        if (termsLines == null || termsLines.isEmpty()) {
            termsLines = List.of(
                    "Forma de pago: a la aceptación del presupuesto 50%, resto el día anterior del suministro del material.",
                    "Validez del presupuesto: 15 días.",
                    "Cualquier modificación de la presente oferta llevará consigo un nuevo estudio."
            );
        }
        if (signatureLeftLabel == null || signatureLeftLabel.isBlank()) signatureLeftLabel = "Conforme el cliente";
        if (signatureRightLabel == null || signatureRightLabel.isBlank()) signatureRightLabel = "Conforme la empresa";
    }
}
