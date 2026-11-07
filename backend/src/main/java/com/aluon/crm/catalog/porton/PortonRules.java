package com.aluon.crm.catalog.porton;

import com.aluon.crm.quote.dto.QuoteItemRequest;
import java.util.List;
import java.util.Objects;

public final class PortonRules {
    private PortonRules() {}

    public static void validate(QuoteItemRequest item) {
        PortonConfiguration config = item.getPortonConfiguration();
        if (config == null) return;
        PortonCatalog catalog = PortonCatalog.reference();
        var variant = catalog.variants().stream().filter(v -> v.code().equals(config.variantCode()))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Variante de portón no válida"));
        var type = item.getDoorType() != null ? item.getDoorType() : item.getOpeningVariant();
        require(type == variant.doorType() && item.getProductCategory() == variant.productCategory(),
                "La variante del portón no corresponde al producto seleccionado");
        require(item.getOpeningVariant() == null || item.getOpeningVariant() == type,
                "La apertura no corresponde al portón seleccionado");
        range(item.getWidthMm(), variant.minWidthMm(), variant.maxWidthMm(), "Ancho");
        range(item.getHeightMm(), variant.minHeightMm(), variant.maxHeightMm(), "Alto");
        require(variant.panelCodes().contains(config.panelCode()), "Panel no disponible para esta variante");
        require(List.of("HORIZONTAL", "VERTICAL").contains(Objects.toString(config.orientation(), "")),
                "Indica la orientación del panel");
        require(!variant.code().equals("VALLADO_HORIZONTAL") || "HORIZONTAL".equals(config.orientation()),
                "El vallado horizontal requiere panel horizontal");
        require(catalog.finishes().stream().anyMatch(f -> f.code().equals(config.finishCode())), "Acabado no válido");
        if ("OTRO_RAL".equals(config.finishCode())) {
            require(config.customRal() != null && config.customRal().matches("[0-9]{4}"), "Indica un RAL de cuatro cifras");
        } else {
            require(config.customRal() == null || config.customRal().isBlank(), "El RAL personalizado requiere Otro RAL");
        }
        require(!config.motorized() || variant.motorAllowed(), "Esta variante no admite motor");
        require(!config.motorized() || config.safetyPhotocell() || config.safetyEdge(),
                "El portón motorizado requiere fotocélula y/o banda resistiva");
        require(config.motorized() || (!config.safetyPhotocell() && !config.safetyEdge()),
                "La seguridad del motor requiere motorización");
        boolean sliding = variant.code().startsWith("CORREDERA") || variant.code().equals("TELESCOPICA");
        if (sliding) {
            require(List.of("EMPOTRADA", "SUPERFICIE", "SIN_GUIA").contains(Objects.toString(config.guide(), "")), "Indica la guía de la corredera");
        } else {
            require(config.guide() == null, "La guía solo corresponde a correderas");
        }
        if (sliding || variant.code().startsWith("PIVOTANTE")) {
            require(List.of("SOLAPADO", "SUPERFICIE").contains(Objects.toString(config.closingProfile(), "")), "Indica el perfil de cierre");
        } else {
            require(config.closingProfile() == null, "El perfil de cierre solo corresponde a correderas o pivotantes");
        }
        if (variant.code().startsWith("PEATONAL")) {
            range(item.getFloorClearanceMm(), 10, 15, "Holgura inferior");
        }
    }

    private static void range(Integer value, Integer min, int max, String label) {
        require(value != null && value > 0 && (min == null || value >= min) && value <= max,
                label + " fuera de rango (" + (min == null ? "> 0" : min) + "–" + max + " mm)");
    }

    private static void require(boolean condition, String message) {
        if (!condition) throw new IllegalArgumentException(message);
    }
}
