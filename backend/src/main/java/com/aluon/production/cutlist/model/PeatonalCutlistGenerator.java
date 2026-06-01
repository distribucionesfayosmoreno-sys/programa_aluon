package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class PeatonalCutlistGenerator implements DoorCutlistGenerator {

    private final CutlistLineFactory lineFactory;
    private final CutlistModelRules modelRules;
    private final UnevennessCalculator unevennessCalculator;
    private final LamaCutlistAppender lamaAppender;

    public PeatonalCutlistGenerator(
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
        return DoorType.PEATONAL;
    }

    @Override
    public List<CutlistLine> generate(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        int holguraSuelo = request.getGroundClearanceMm();
        int holgura = 18;
        int holguraLamasVertical = 125;
        int holguraLamasHorizontal = 125;
        int perfilPuerta = request.getLargueroMm();
        boolean marcoSuperior = Boolean.TRUE.equals(request.getTopFrame());
        DoorModel modelo = request.getModel();

        int lama = modelRules.lamaForModel(modelo);
        if (modelo == DoorModel.VENECIANA) {
            holguraLamasHorizontal = 6;
        }

        List<CutlistLine> items = new ArrayList<>();

        int medidaAnchoInterior = ancho - (perfilPuerta * 2) - holgura;
        int medidaAlturaInterior;
        if (marcoSuperior) {
            int holguraLargeroSuperior = 6;
            medidaAlturaInterior = alto - holguraSuelo - holguraLargeroSuperior - perfilPuerta;
        } else {
            medidaAlturaInterior = alto - holguraSuelo;
        }

        double numeroDeLamas = (double) (medidaAlturaInterior - holguraLamasVertical) / lama;
        int numeroDeLamasEntero = (int) Math.floor(numeroDeLamas);
        int lamaRestante = (medidaAlturaInterior - holguraLamasVertical) - (numeroDeLamasEntero * lama);

        Unevenness unevenness = unevennessCalculator.calculate(request);

        if (marcoSuperior) {
            if (perfilPuerta == 50) {
                lineFactory.addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", 2, alto);
                lineFactory.addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
            } else {
                lineFactory.addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", 2, alto);
                lineFactory.addItem(items, "Larguero Vertical 50x80 con pestaña con corte inglete 45º Contrario", 1, ancho);
            }
            if (modelo == DoorModel.VENECIANA) {
                modelRules.addMarcoInteriorVeneciana(
                        items,
                        "Marco Horizontal 50x50 con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 con corte inglete troquelado 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior
                );
            } else {
                if (unevenness.present()) {
                    modelRules.addMarcoInteriorWithUnevenBottom(items, modelo, medidaAnchoInterior, medidaAlturaInterior, unevenness);
                } else {
                    modelRules.addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            }
        } else {
            if (perfilPuerta == 50) {
                lineFactory.addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto", 2, alto);
            } else {
                lineFactory.addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto", 2, alto);
            }
            if (modelo == DoorModel.VENECIANA) {
                modelRules.addMarcoInteriorVeneciana(
                        items,
                        "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior
                );
            } else {
                if (unevenness.present()) {
                    modelRules.addMarcoInteriorWithUnevenBottom(items, modelo, medidaAnchoInterior, medidaAlturaInterior, unevenness);
                } else {
                    modelRules.addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            }
        }

        lamaAppender.addSingleLeafLamas(
                items,
                modelo,
                numeroDeLamasEntero,
                lamaRestante,
                medidaAnchoInterior - holguraLamasHorizontal,
                unevenness
        );

        return items;
    }
}
