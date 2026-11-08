package com.aluon.crm.catalog.porton;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import java.io.IOException;
import java.util.List;

public record PortonCatalog(String source, List<String> notes, List<Variant> variants,
                            List<Panel> panels, List<Finish> finishes) {
    public record Variant(String code, String label, DoorType doorType, ProductCategory productCategory,
                          Integer minWidthMm, int maxWidthMm, Integer minHeightMm, int maxHeightMm,
                          boolean motorAllowed, List<String> panelCodes) {}
    public record Panel(String code, String label, Double kgPerM2) {}
    public record Finish(String code, String label, String group) {}

    private static final PortonCatalog INSTANCE = load();

    public static PortonCatalog reference() { return INSTANCE; }

    private static PortonCatalog load() {
        try (var stream = new ClassPathResource("catalog/portones.json").getInputStream()) {
            return new ObjectMapper().readValue(stream, PortonCatalog.class);
        } catch (IOException ex) {
            throw new IllegalStateException("No se pudo cargar la referencia de portones", ex);
        }
    }
}
