package com.aluon.production.cutlist.model;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CutlistLineFactory {

    public void addItem(List<CutlistLine> items, String description, int units, Object measure) {
        items.add(new CutlistLine(description, units, formatMeasure(measure)));
    }

    public String formatMeasure(Object measure) {
        if (measure instanceof String text) {
            return text + "mm";
        }
        if (measure instanceof Integer value) {
            return value + "mm";
        }
        if (measure instanceof Long value) {
            return value + "mm";
        }
        if (measure instanceof Double value) {
            return formatNumber(value) + "mm";
        }
        return String.valueOf(measure) + "mm";
    }

    public String formatNumber(double value) {
        return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
    }
}

