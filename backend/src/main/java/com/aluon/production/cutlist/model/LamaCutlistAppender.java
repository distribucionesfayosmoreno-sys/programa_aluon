package com.aluon.production.cutlist.model;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class LamaCutlistAppender {

    private final CutlistLineFactory lineFactory;
    private final CutlistModelRules modelRules;

    public LamaCutlistAppender(CutlistLineFactory lineFactory, CutlistModelRules modelRules) {
        this.lineFactory = lineFactory;
        this.modelRules = modelRules;
    }

    public void addSingleLeafLamas(
            List<CutlistLine> items,
            DoorModel model,
            int fullSlatsCount,
            int remainderMm,
            double slatWidthMm,
            Unevenness unevenness
    ) {
        addLamasInternal(items, model, 1, fullSlatsCount, remainderMm, slatWidthMm, unevenness);
    }

    public void addDoubleLeafLamas(
            List<CutlistLine> items,
            DoorModel model,
            int fullSlatsCount,
            int remainderMm,
            double slatWidthMm,
            Unevenness unevenness
    ) {
        addLamasInternal(items, model, 2, fullSlatsCount, remainderMm, slatWidthMm, unevenness);
    }

    private void addLamasInternal(
            List<CutlistLine> items,
            DoorModel model,
            int leaves,
            int fullSlatsCount,
            int remainderMm,
            double slatWidthMm,
            Unevenness unevenness
    ) {
        int slatHeight = modelRules.lamaForModel(model);

        int normalizedFull = fullSlatsCount;
        int normalizedRemainder = remainderMm;
        if (unevenness != null && unevenness.present() && normalizedRemainder == 0 && normalizedFull > 0) {
            normalizedRemainder = slatHeight;
            normalizedFull -= 1;
        }

        double measureWidthMm = slatWidthForModel(model, slatWidthMm);
        if (unevenness == null || !unevenness.present()) {
            int totalFullUnits = normalizedFull * leaves;
            if (totalFullUnits > 0) {
                lineFactory.addItem(items, slatFullDescription(model), totalFullUnits, measureWidthMm);
                if (model == DoorModel.INOX) {
                    lineFactory.addItem(items, "Tubo Inoxidable 60x20 corte recto", totalFullUnits, measureWidthMm);
                }
            }
            if (normalizedRemainder > 0) {
                lineFactory.addItem(
                        items,
                        slatAdditionalDescription(model, "corte recto"),
                        leaves,
                        normalizedRemainder + "mm X " + lineFactory.formatNumber(measureWidthMm)
                );
            }
            return;
        }

        int totalFullUnits = normalizedFull * leaves;
        if (totalFullUnits > 0) {
            lineFactory.addItem(items, slatFullDescription(model), totalFullUnits, measureWidthMm);
            if (model == DoorModel.INOX) {
                lineFactory.addItem(items, "Tubo Inoxidable 60x20 corte recto", totalFullUnits, measureWidthMm);
            }
        }

        if (normalizedRemainder <= 0) {
            return;
        }

        int dropMm = safeInt(Math.round(slatWidthMm * unevenness.slopeTan()));
        int bottomSideMm = Math.max(0, normalizedRemainder - dropMm);
        String cut = String.format(
                "corte inglete %s (superior: %dmm, inferior: %dmm)",
                unevenness.angle(),
                normalizedRemainder,
                bottomSideMm
        );
        lineFactory.addItem(
                items,
                slatAdditionalDescription(model, cut),
                leaves,
                normalizedRemainder + "mm X " + lineFactory.formatNumber(measureWidthMm)
        );
    }

    private double slatWidthForModel(DoorModel model, double baseWidthMm) {
        if (model == DoorModel.INOX) {
            return baseWidthMm - 35;
        }
        return baseWidthMm;
    }

    private int safeInt(long value) {
        if (value > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }
        if (value < Integer.MIN_VALUE) {
            return Integer.MIN_VALUE;
        }
        return (int) value;
    }

    private String slatFullDescription(DoorModel model) {
        return switch (model) {
            case PREMIUM -> "Lama 200x20 corte recto";
            case CLASSIC -> "Lama 100x20 corte recto";
            case INOX -> "Lama 200x26 corte recto";
            case VENECIANA -> "Lama 100 Avión corte recto";
        };
    }

    private String slatAdditionalDescription(DoorModel model, String cut) {
        return switch (model) {
            case PREMIUM -> "Lama adicional Lama 200x20 " + cut;
            case CLASSIC -> "Lama adicional Lama 100x20 " + cut;
            case INOX -> "Lama adicional Lama 200x26 " + cut;
            case VENECIANA -> "Lama adicional Lama 100 Avión " + cut;
        };
    }
}
