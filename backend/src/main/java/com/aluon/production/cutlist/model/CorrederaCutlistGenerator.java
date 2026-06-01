package com.aluon.production.cutlist.model;

import com.aluon.production.cutlist.dto.CutlistRequestDto;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class CorrederaCutlistGenerator implements DoorCutlistGenerator {

    private final CutlistLineFactory lineFactory;
    private final CutlistModelRules modelRules;

    public CorrederaCutlistGenerator(CutlistLineFactory lineFactory, CutlistModelRules modelRules) {
        this.lineFactory = lineFactory;
        this.modelRules = modelRules;
    }

    @Override
    public DoorType supports() {
        return DoorType.CORREDERA;
    }

    @Override
    public List<CutlistLine> generate(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        DoorModel modelo = request.getModel();
        boolean refuerzo = Boolean.TRUE.equals(request.getAutomationReinforcement());
        boolean cola = Boolean.TRUE.equals(request.getTail());
        RailType carrilTipo = request.getRailType();
        MountingType montaje = request.getMountingType();
        int restaRefuerzoMotor = 160;
        int lama = modelRules.lamaForModel(modelo);

        if (modelo == DoorModel.VENECIANA) {
            restaRefuerzoMotor = 6;
        }

        int carril = (carrilTipo == RailType.CARRIL_16) ? 35 : 40;
        int marcoSuperior = ancho + 250;
        int marcoCierre = alto - carril;
        int marcoPosterior = marcoCierre - (cola ? 80 : 160);

        int medidaAnchoInterior;
        int medidaAlturaInterior;
        if (modelo == DoorModel.INOX) {
            medidaAnchoInterior = ancho - 160;
            medidaAlturaInterior = alto - 160;
        } else if (modelo == DoorModel.VENECIANA) {
            medidaAnchoInterior = ancho - 6;
            medidaAlturaInterior = alto - 100;
        } else {
            medidaAnchoInterior = ancho - 125;
            medidaAlturaInterior = alto - 125;
        }

        double numeroDeLamas = (double) (medidaAlturaInterior - carril) / lama;
        int numeroDeLamasEntero = (int) Math.floor(numeroDeLamas);
        int lamaRestante = (medidaAlturaInterior - carril) - (numeroDeLamasEntero * lama);

        List<CutlistLine> items = new ArrayList<>();

        if (modelo == DoorModel.VENECIANA) {
            lineFactory.addItem(items, "Marco Superior 50x50", 1, marcoSuperior);
            lineFactory.addItem(items, "Marco de cierre 50x50 Ranura", 1, marcoCierre);
        } else if (modelo == DoorModel.INOX) {
            lineFactory.addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, ancho);
            lineFactory.addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, marcoCierre);
            lineFactory.addItem(items, "Cola Superior 80x50 con corte recto 90º", 1, 250);
        } else {
            lineFactory.addItem(items, "Marco Superior 80x50 Ranura", 1, marcoSuperior);
            lineFactory.addItem(items, "Marco de cierre 80x50 Ranura", 1, marcoCierre);
        }

        if (cola) {
            if (modelo == DoorModel.VENECIANA) {
                lineFactory.addItem(items, "Marco Inferior 50x50 Ranura", 1, marcoSuperior);
                lineFactory.addItem(items, "Marco Posterior 50x50 Ranura", 1, marcoPosterior);
            } else if (modelo == DoorModel.INOX) {
                lineFactory.addItem(items, "Cola Motor 80x50 con corte recto 90º", 1, 250);
            } else {
                lineFactory.addItem(items, "Marco Inferior 80x50 Ranura", 1, marcoSuperior);
                lineFactory.addItem(items, "Marco Posterior 80x50 Ranura", 1, marcoPosterior);
            }
        } else {
            if (modelo != DoorModel.INOX) {
                lineFactory.addItem(items, "Marco Inferior 80x50 Inglete Contrario", 1, marcoSuperior - 250);
                lineFactory.addItem(items, "Marco Posterior 80x50 Ranura Inglete Contrario", 1, marcoCierre - 80);
            }
        }

        lineFactory.addItem(items, "Perfil Ruedas Correderas Corte Recto", 1, marcoSuperior - 5);

        if (modelo == DoorModel.PREMIUM) {
            lineFactory.addItem(items, "Lama 200x20 corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                lineFactory.addItem(items, "Lama adicional Lama 200x20 corte recto", 1, lamaRestante + "mm X " + medidaAnchoInterior);
            }
        } else if (modelo == DoorModel.CLASSIC) {
            lineFactory.addItem(items, "Lama 100x20 corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                lineFactory.addItem(items, "Lama adicional Lama 100x20 corte recto", 1, lamaRestante + "mm X " + medidaAnchoInterior);
            }
        } else if (modelo == DoorModel.INOX) {
            lineFactory.addItem(items, "Lama 200x26 corte recto", numeroDeLamasEntero, ancho - 160);
            if (lamaRestante > 0) {
                lineFactory.addItem(items, "Lama adicional Lama 200x26 corte recto", 1, lamaRestante + "mm X " + (ancho - 160));
            }
            lineFactory.addItem(items, "Tubo Inoxidable 60x20 corte recto", numeroDeLamasEntero, ancho - 160);
        } else if (modelo == DoorModel.VENECIANA) {
            lineFactory.addItem(items, "Lama 100 Avión corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                lineFactory.addItem(items, "Lama adicional Lama 100 Avión corte recto", 1, lamaRestante + "mm X " + medidaAnchoInterior);
            }
        }

        if (montaje == MountingType.A) {
            lineFactory.addItem(items, "Poste de cierre sin pestañas", 1, alto);
        } else if (montaje == MountingType.B) {
            lineFactory.addItem(items, "Poste de cierre con pestañas", 1, alto);
        }

        if (refuerzo) {
            if (modelo == DoorModel.INOX) {
                lineFactory.addItem(items, "Tubo 50x50 Refuerzo Motor Inoxidable", 1, ancho + 310);
            } else {
                lineFactory.addItem(items, "Tubo 40x15 Refuerzo Motor", 1, medidaAnchoInterior - restaRefuerzoMotor);
            }
        }

        return items;
    }
}

