package com.aluon.crm.catalog.porton;

import java.util.ArrayList;

public final class PortonDescription {
    private PortonDescription() {}

    public static String describe(PortonConfiguration c) {
        if (c == null) return "";
        var catalog = PortonCatalog.reference();
        var parts = new ArrayList<String>();
        parts.add(catalog.variants().stream().filter(v -> v.code().equals(c.variantCode())).map(PortonCatalog.Variant::label).findFirst().orElse(c.variantCode()));
        parts.add("Panel: " + c.panelCode() + " · " + c.orientation());
        parts.add("Acabado: " + catalog.finishes().stream().filter(f -> f.code().equals(c.finishCode())).map(PortonCatalog.Finish::label).findFirst().orElse(c.finishCode())
                + (c.customRal() == null ? "" : " " + c.customRal()));
        if (c.guide() != null) parts.add("Guía: " + c.guide());
        if (c.closingProfile() != null) parts.add("Cierre: " + c.closingProfile());
        parts.add(c.motorized() ? "Motorizado" : "Manual / fijo");
        if (c.safetyPhotocell()) parts.add("Fotocélula");
        if (c.safetyEdge()) parts.add("Banda resistiva");
        parts.add("Referencia técnica; panel, acabado, motor y accesorios pendientes de valoración");
        return String.join(" · ", parts);
    }
}
