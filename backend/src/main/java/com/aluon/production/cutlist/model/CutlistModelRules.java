package com.aluon.production.cutlist.model;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CutlistModelRules {

    private final CutlistLineFactory lineFactory;
    private final BottomFrameMiterCalculator bottomFrameMiterCalculator;

    public CutlistModelRules(CutlistLineFactory lineFactory, BottomFrameMiterCalculator bottomFrameMiterCalculator) {
        this.lineFactory = lineFactory;
        this.bottomFrameMiterCalculator = bottomFrameMiterCalculator;
    }

    public int lamaForModel(DoorModel model) {
        return switch (model) {
            case PREMIUM -> 200;
            case CLASSIC -> 100;
            case INOX -> 216;
            case VENECIANA -> 95;
        };
    }

    public void addMarcoInterior(List<CutlistLine> items, DoorModel model, int widthInnerMm, int heightInnerMm) {
        if (model == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, widthInnerMm);
            lineFactory.addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, heightInnerMm);
            return;
        }
        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 2, widthInnerMm);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 2, heightInnerMm);
    }

    public void addMarcoInteriorWithUnevenBottom(
            List<CutlistLine> items,
            DoorModel model,
            int widthInnerMm,
            int heightInnerMm,
            Unevenness unevenness
    ) {
        BottomFrameMiterCalculator.BottomFrameMiter bottomMiter = bottomFrameMiterCalculator.calculate(unevenness, widthInnerMm);
        String bottomAngles = bottomMiter.angleLeft() + "/" + bottomMiter.angleRight();

        int diff = unevenness == null ? 0 : unevenness.diffMm();
        int maxHeight = heightInnerMm;
        int minHeight = Math.max(0, heightInnerMm - diff);

        boolean leftHigher = unevenness != null && unevenness.present() && unevenness.isLeftHigher();
        int leftHeight = leftHigher ? minHeight : maxHeight;
        int rightHeight = leftHigher ? maxHeight : minHeight;

        if (model == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 1, widthInnerMm);
            lineFactory.addItem(items, "Marco Horizontal Inox 100x50 con corte inglete " + bottomAngles, 1, bottomMiter.lengthMm());
            lineFactory.addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 1, leftHeight);
            lineFactory.addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 1, rightHeight);
            return;
        }

        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 1, widthInnerMm);
        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete " + bottomAngles, 1, bottomMiter.lengthMm());
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 1, leftHeight);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 1, rightHeight);
    }

    public void addMarcoInteriorVeneciana(
            List<CutlistLine> items,
            String horizontalDesc,
            String verticalDesc,
            double widthInnerMm,
            double heightInnerMm
    ) {
        lineFactory.addItem(items, horizontalDesc, 2, widthInnerMm);
        lineFactory.addItem(items, verticalDesc, 2, heightInnerMm);
    }

    public void addMarcoInteriorDoble(List<CutlistLine> items, DoorModel model, int widthInnerMm, int heightInnerMm) {
        if (model == DoorModel.VENECIANA) {
            lineFactory.addItem(items, "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", 2, widthInnerMm / 2.0);
            lineFactory.addItem(items, "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", 2, heightInnerMm);
            return;
        }
        if (model == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal 80x50 con corte inglete 45º Contrario", 4, widthInnerMm / 2.0);
            lineFactory.addItem(items, "Marco Vertical 80x50 con corte inglete 45º Contrario", 3, heightInnerMm);
            lineFactory.addItem(items, "Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", 1, heightInnerMm + 40);
            return;
        }
        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 4, widthInnerMm / 2.0);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 3, heightInnerMm);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", 1, heightInnerMm + 40);
    }

    public void addMarcoInteriorDobleWithUnevenBottom(
            List<CutlistLine> items,
            DoorModel model,
            int widthInnerMm,
            int heightInnerMm,
            Unevenness unevenness
    ) {
        double leafWidthInner = widthInnerMm / 2.0;
        BottomFrameMiterCalculator.BottomFrameMiter bottomMiter = bottomFrameMiterCalculator.calculate(unevenness, leafWidthInner);
        String bottomAngles = bottomMiter.angleLeft() + "/" + bottomMiter.angleRight();

        int diff = unevenness == null ? 0 : unevenness.diffMm();
        int maxHeight = heightInnerMm;
        int minHeight = Math.max(0, heightInnerMm - diff);
        boolean leftHigher = unevenness != null && unevenness.present() && unevenness.isLeftHigher();
        int leftHeight = leftHigher ? minHeight : maxHeight;
        int rightHeight = leftHigher ? maxHeight : minHeight;

        if (model == DoorModel.VENECIANA) {
            lineFactory.addItem(items, "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", 2, leafWidthInner);
            lineFactory.addItem(items, "Marco Horizontal 50x50 troquelado con corte inglete " + bottomAngles, 2, bottomMiter.lengthMm());
            lineFactory.addItem(items, "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", 1, leftHeight);
            lineFactory.addItem(items, "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", 1, rightHeight);
            return;
        }

        if (model == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal 80x50 con corte inglete 45º Contrario", 2, leafWidthInner);
            lineFactory.addItem(items, "Marco Horizontal 80x50 con corte inglete " + bottomAngles, 2, bottomMiter.lengthMm());
            lineFactory.addItem(items, "Marco Vertical 80x50 con corte inglete 45º Contrario", 2, leftHeight);
            lineFactory.addItem(items, "Marco Vertical 80x50 con corte inglete 45º Contrario", 1, rightHeight);
            lineFactory.addItem(items, "Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", 1, rightHeight + 40);
            return;
        }

        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 2, leafWidthInner);
        lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete " + bottomAngles, 2, bottomMiter.lengthMm());
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 2, leftHeight);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 1, rightHeight);
        lineFactory.addItem(items, "Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", 1, rightHeight + 40);
    }
}
