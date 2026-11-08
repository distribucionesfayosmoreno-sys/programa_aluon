package com.aluon.crm.catalog.porton;

import com.aluon.crm.quote.dto.QuoteItemRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import java.util.stream.Stream;
import static org.assertj.core.api.Assertions.*;

class PortonRulesTest {
    static Stream<PortonCatalog.Variant> variants() { return PortonCatalog.reference().variants().stream(); }

    static QuoteItemRequest item(String variantCode, String panel, int width, int height, boolean motor, boolean photocell, boolean edge) {
        var v = PortonCatalog.reference().variants().stream().filter(entry -> entry.code().equals(variantCode)).findFirst().orElseThrow();
        var request = new QuoteItemRequest();
        request.setDoorType(v.doorType());
        request.setProductCategory(v.productCategory());
        request.setWidthMm(width);
        request.setHeightMm(height);
        request.setFloorClearanceMm(10);
        boolean sliding = v.doorType() == com.aluon.production.cutlist.model.DoorType.CORREDERA;
        request.setPortonConfiguration(new PortonConfiguration(variantCode, panel, "HORIZONTAL", "RAL_7016_TM", null,
                motor, photocell, edge, sliding ? "SUPERFICIE" : null,
                sliding || variantCode.startsWith("PIVOTANTE") ? "SOLAPADO" : null));
        return request;
    }

    @ParameterizedTest
    @MethodSource("variants")
    void acceptsDocumentedBoundariesForAllVariants(PortonCatalog.Variant v) {
        assertThatCode(() -> PortonRules.validate(item(v.code(), v.panelCodes().get(0), v.maxWidthMm(), v.maxHeightMm(), false, false, false))).doesNotThrowAnyException();
        assertThatCode(() -> PortonRules.validate(item(v.code(), v.panelCodes().get(0), v.minWidthMm() == null ? 1 : v.minWidthMm(), v.minHeightMm() == null ? 1 : v.minHeightMm(), false, false, false))).doesNotThrowAnyException();
        assertThatThrownBy(() -> PortonRules.validate(item(v.code(), v.panelCodes().get(0), v.maxWidthMm() + 1, v.maxHeightMm(), false, false, false))).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("Ancho");
        assertThatThrownBy(() -> PortonRules.validate(item(v.code(), v.panelCodes().get(0), v.maxWidthMm(), v.maxHeightMm() + 1, false, false, false))).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("Alto");
    }

    @ParameterizedTest
    @CsvSource({"true,false", "false,true", "true,true"})
    void motorAcceptsEitherOrBothSafetyDevices(boolean photocell, boolean edge) {
        assertThatCode(() -> PortonRules.validate(item("TELESCOPICA", "M200", 6200, 3000, true, photocell, edge))).doesNotThrowAnyException();
    }

    @Test void motorRequiresSafetyAndIsNotAvailableOnFences() {
        assertThatThrownBy(() -> PortonRules.validate(item("PIVOTANTE_UNA", "B150", 3000, 2000, true, false, false))).hasMessageContaining("fotocélula");
        assertThatThrownBy(() -> PortonRules.validate(item("VALLADO_VERTICAL", "B150", 2000, 2000, true, true, false))).hasMessageContaining("no admite motor");
    }

    @Test void respectsPanelCompatibility() {
        assertThatThrownBy(() -> PortonRules.validate(item("CORREDERA_UNA", "B300", 3000, 2000, false, false, false))).hasMessageContaining("Panel");
        assertThatThrownBy(() -> PortonRules.validate(item("VALLADO_HORIZONTAL", "LV", 2000, 2000, false, false, false))).hasMessageContaining("Panel");
        assertThatCode(() -> PortonRules.validate(item("PIVOTANTE_DOS", "B300", 6000, 2000, false, false, false))).doesNotThrowAnyException();
    }

    @ParameterizedTest @CsvSource({"9", "16", "-1"})
    void pedestrianRequiresDocumentedClearance(int clearance) {
        var request = item("PEATONAL_GRANDE", "M200", 1600, 2600, false, false, false);
        request.setFloorClearanceMm(clearance);
        assertThatThrownBy(() -> PortonRules.validate(request)).hasMessageContaining("Holgura");
    }

    @Test void rejectsMismatchAndForgedOptions() {
        var request = item("CORREDERA_UNA", "M200", 3000, 2000, false, false, false);
        request.setProductCategory(com.aluon.crm.catalog.model.ProductCategory.REJA);
        var mismatch = request;
        assertThatThrownBy(() -> PortonRules.validate(mismatch)).hasMessageContaining("no corresponde");
        request = item("CORREDERA_UNA", "M200", 3000, 2000, false, false, false);
        var original = request.getPortonConfiguration();
        request.setPortonConfiguration(new PortonConfiguration(original.variantCode(), original.panelCode(), original.orientation(), "OTRO_RAL", "<script>", false, false, false, original.guide(), original.closingProfile()));
        var invalidRal = request;
        assertThatThrownBy(() -> PortonRules.validate(invalidRal)).hasMessageContaining("cuatro cifras");
    }

    @Test void existingQuotesWithoutTechnicalConfigurationKeepTheirRules() {
        assertThatCode(() -> PortonRules.validate(new QuoteItemRequest())).doesNotThrowAnyException();
    }

    @Test void technicalConfigurationSurvivesStorageAndHasReadableDescription() {
        var config = item("TELESCOPICA", "M200", 3000, 2000, true, true, false).getPortonConfiguration();
        var converter = new PortonConfigurationConverter();
        assertThat(converter.convertToEntityAttribute(converter.convertToDatabaseColumn(config))).isEqualTo(config);
        assertThat(converter.convertToEntityAttribute(null)).isNull();
        assertThat(PortonDescription.describe(config)).contains("telescópica", "M200", "7016", "Fotocélula", "pendientes de valoración");
    }
}
