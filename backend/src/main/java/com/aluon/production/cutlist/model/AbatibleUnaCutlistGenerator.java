package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AbatibleUnaCutlistGenerator implements DoorCutlistGenerator {

    private final CutlistLineFactory lineFactory;
    private final CutlistModelRules modelRules;
    private final UnevennessCalculator unevennessCalculator;
    private final LamaCutlistAppender lamaAppender;

    public AbatibleUnaCutlistGenerator(
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
        return DoorType.ABATIBLE_UNA;
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
        boolean refuerzo = Boolean.TRUE.equals(request.getAutomationReinforcement());
        DoorModel modelo = request.getModel();
        int restaRefuerzoMotor = 160;

        int lama = modelRules.lamaForModel(modelo);
        if (modelo == DoorModel.VENECIANA) {
            holguraLamasHorizontal = 6;
            restaRefuerzoMotor = 6;
        }

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

        List<CutlistLine> items = new ArrayList<>();

        Unevenness unevenness = unevennessCalculator.calculate(request);

        if (marcoSuperior) {
            if (unevenness.present()) {
                if (perfilPuerta == 50) {
                    lineFactory.addItem(items, "Larguero Vertical Izq 50x50 con pestaña con corte recto e inglete 45º", 1, unevenness.heightLeftMm());
                    lineFactory.addItem(items, "Larguero Vertical Der 50x50 con pestaña con corte recto e inglete 45º", 1, unevenness.heightRightMm());
                    lineFactory.addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
                } else {
                    lineFactory.addItem(items, "Larguero Vertical Izq 50x80 con pestaña con corte recto e inglete 45º", 1, unevenness.heightLeftMm());
                    lineFactory.addItem(items, "Larguero Vertical Der 50x80 con pestaña con corte recto e inglete 45º", 1, unevenness.heightRightMm());
                    lineFactory.addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
                }
                if (modelo == DoorModel.VENECIANA) {
                    modelRules.addMarcoInteriorVeneciana(
                            items,
                            "Marco Horizontal Sup 50x50 troquelado con corte inglete " + unevenness.angle() + " Contrario",
                            "Marco Vertical 50x50 troquelado con corte inglete " + unevenness.angle() + " Contrario",
                            unevenness.slantedWidthMm(),
                            medidaAlturaInterior
                    );
                } else {
                    modelRules.addMarcoInteriorWithUnevenBottom(items, modelo, medidaAnchoInterior, medidaAlturaInterior, unevenness);
                }
            } else {
                if (perfilPuerta == 50) {
                    lineFactory.addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", 2, alto);
                    lineFactory.addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
                } else {
                    lineFactory.addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", 2, alto);
                    lineFactory.addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte inglete 45º Contrario", 1, ancho);
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
                    modelRules.addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            }
        } else {
            if (modelo == DoorModel.VENECIANA) {
                modelRules.addMarcoInteriorVeneciana(
                        items,
                        "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior
                );
            } else if (perfilPuerta == 50) {
                if (unevenness.present()) {
                    lineFactory.addItem(items, "Larguero Vertical Izq 50x50 con pestaña con corte recto", 1, unevenness.heightLeftMm());
                    lineFactory.addItem(items, "Larguero Vertical Der 50x50 con pestaña con corte recto", 1, unevenness.heightRightMm());
                } else {
                    lineFactory.addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto", 2, alto);
                }
                if (unevenness.present()) {
                    modelRules.addMarcoInteriorWithUnevenBottom(items, modelo, medidaAnchoInterior, medidaAlturaInterior, unevenness);
                } else {
                    modelRules.addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            } else {
                if (unevenness.present()) {
                    lineFactory.addItem(items, "Larguero Vertical Izq 50x80 con pestaña con corte recto", 1, unevenness.heightLeftMm());
                    lineFactory.addItem(items, "Larguero Vertical Der 50x80 con pestaña con corte recto", 1, unevenness.heightRightMm());
                } else {
                    lineFactory.addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto", 2, alto);
                }
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

        if (refuerzo) {
            if (modelo == DoorModel.INOX) {
                lineFactory.addItem(items, "Tubo 50x50 Refuerzo Motor Inoxidable", 1, medidaAnchoInterior + 80);
            } else {
                lineFactory.addItem(items, "Tubo 40x15 Refuerzo Motor", 1, medidaAnchoInterior - restaRefuerzoMotor);
            }
        }

        return items;
    }
}
