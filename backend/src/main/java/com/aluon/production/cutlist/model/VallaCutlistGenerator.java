package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class VallaCutlistGenerator implements DoorCutlistGenerator {

    private final CutlistLineFactory lineFactory;
    private final CutlistModelRules modelRules;
    private final UnevennessCalculator unevennessCalculator;
    private final LamaCutlistAppender lamaAppender;

    public VallaCutlistGenerator(
            CutlistLineFactory lineFactory,
            CutlistModelRules modelRules,
            UnevennessCalculator unevennessCalculator,
            LamaCutlistAppender lamaAppender
    ) {
        this.lineFactory = lineFactory;
        this.modelRules = modelRules;
        this.unevennessCalculator = unevennessCalculator;
        this.lamaAppender = lamaAppender;
    }

    @Override
    public DoorType supports() {
        return DoorType.VALLA;
    }

    @Override
    public List<CutlistLine> generate(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        DoorModel modelo = request.getModel();

        int holguraLamasVertical = 125;
        int holguraLamasHorizontal = 125;
        int lama = modelRules.lamaForModel(modelo);

        if (modelo == DoorModel.VENECIANA) {
            holguraLamasHorizontal = 6;
        }

        int medidaAnchoInterior = ancho - holguraLamasHorizontal;
        int medidaAlturaInterior = alto - holguraLamasVertical;
        double numeroDeLamas = (double) medidaAlturaInterior / lama;
        int numeroDeLamasEntero = (int) Math.floor(numeroDeLamas);
        int lamaRestante = medidaAlturaInterior - (numeroDeLamasEntero * lama);

        List<CutlistLine> items = new ArrayList<>();

        if (modelo == DoorModel.VENECIANA) {
            lineFactory.addItem(items, "Marco Horizontal 50x50 con corte inglete 45º Contrario", 2, ancho);
            lineFactory.addItem(items, "Marco Vertical 50x50 con corte inglete troquelado 45º Contrario", 2, alto);
        } else if (modelo == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, alto);
            lineFactory.addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, ancho);
        } else {
            lineFactory.addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 2, alto);
            lineFactory.addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 2, ancho);
        }

        Unevenness unevenness = unevennessCalculator.calculate(request);
        lamaAppender.addSingleLeafLamas(items, modelo, numeroDeLamasEntero, lamaRestante, medidaAnchoInterior, unevenness);

        return items;
    }
}

