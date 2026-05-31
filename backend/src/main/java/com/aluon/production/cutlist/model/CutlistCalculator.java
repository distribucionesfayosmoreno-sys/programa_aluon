package com.aluon.production.cutlist.model;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.aluon.production.cutlist.dto.CutlistRequestDto;


@Component
public class CutlistCalculator {

    public record CutlistLine(String description, int units, String cutMeasure) {
    }

    private record UnevennessInfo(boolean present, int altoIzq, int altoDer, double anchoInclinado, String angleStr, double tanSlope) {}

    private UnevennessInfo getUnevenness(CutlistRequestDto request) {
        boolean present = request.getHeightLeftMm() != null && request.getHeightRightMm() != null 
            && !request.getHeightLeftMm().equals(request.getHeightRightMm());
        if (!present) {
            return new UnevennessInfo(false, request.getHeightMm(), request.getHeightMm(), request.getWidthMm(), "45.00º", 0.0);
        }
        int diff = Math.abs(request.getHeightLeftMm() - request.getHeightRightMm());
        double ang = 90.0 - Math.toDegrees(Math.atan2(diff, request.getWidthMm()));
        double tanSlope = (double) diff / request.getWidthMm();
        return new UnevennessInfo(true, request.getHeightLeftMm(), request.getHeightRightMm(), Math.hypot(request.getWidthMm(), diff), String.format(java.util.Locale.US, "%.2fº", ang), tanSlope);
    }

    public List<CutlistLine> generate(CutlistRequestDto request) {
        return switch (request.getDoorType()) {
            case PEATONAL -> generatePeatonal(request);
            case ABATIBLE_UNA -> generateAbatibleUna(request);
            case ABATIBLE_DOS -> generateAbatibleDos(request);
            case CORREDERA -> generateCorredera(request);
            case VALLA -> generateValla(request);
        };
    }

    private List<CutlistLine> generatePeatonal(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        int holguraSuelo = request.getGroundClearanceMm();
        int holgura = 18;
        int holguraLamasVertical = 125;
        int holguraLamasHorizontal = 125;
        int perfilPuerta = request.getLargueroMm();
        boolean marcoSuperior = Boolean.TRUE.equals(request.getTopFrame());
        DoorModel modelo = request.getModel();

        int lama = lamaForModelo(modelo);
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

        if (marcoSuperior) {
            if (perfilPuerta == 50) {
                addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", 2, alto);
                addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
            } else {
                addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", 2, alto);
                addItem(items, "Larguero Vertical 50x80 con pestaña con corte inglete 45º Contrario", 1, ancho);
            }
            if (modelo == DoorModel.VENECIANA) {
                addMarcoInteriorVeneciana(items,
                        "Marco Horizontal 50x50 con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 con corte inglete troquelado 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior);
            } else {
                addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            }
        } else {
            if (perfilPuerta == 50) {
                addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto", 2, alto);
            } else {
                addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto", 2, alto);
            }
            if (modelo == DoorModel.VENECIANA) {
                addMarcoInteriorVeneciana(items,
                        "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior);
            } else {
                addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            }
        }

        addLamas(items, modelo, numeroDeLamasEntero, lamaRestante, medidaAnchoInterior - holguraLamasHorizontal, getUnevenness(request));
        return items;
    }

    private List<CutlistLine> generateAbatibleUna(CutlistRequestDto request) {
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

        int lama = lamaForModelo(modelo);
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

        UnevennessInfo uInfo = getUnevenness(request);

        if (marcoSuperior) {
            if (uInfo.present) {
                if (perfilPuerta == 50) {
                    addItem(items, "Larguero Vertical Izq 50x50 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoIzq);
                    addItem(items, "Larguero Vertical Der 50x50 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoDer);
                    addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete " + uInfo.angleStr + " Contrario", 1, uInfo.anchoInclinado);
                } else {
                    addItem(items, "Larguero Vertical Izq 50x80 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoIzq);
                    addItem(items, "Larguero Vertical Der 50x80 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoDer);
                    addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte recto inglete " + uInfo.angleStr + " Contrario", 1, uInfo.anchoInclinado);
                }
                if (modelo == DoorModel.VENECIANA) {
                    addMarcoInteriorVeneciana(items,
                            "Marco Horizontal Sup 50x50 troquelado con corte inglete " + uInfo.angleStr + " Contrario",
                            "Marco Vertical 50x50 troquelado con corte inglete " + uInfo.angleStr + " Contrario",
                            uInfo.anchoInclinado,
                            medidaAlturaInterior);
                } else {
                    addMarcoInterior(items, modelo, (int) uInfo.anchoInclinado, medidaAlturaInterior); // simplified for unevenness
                }
            } else {
                if (perfilPuerta == 50) {
                    addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", 2, alto);
                    addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
                } else {
                    addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", 2, alto);
                    addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte inglete 45º Contrario", 1, ancho);
                }
                if (modelo == DoorModel.VENECIANA) {
                    addMarcoInteriorVeneciana(items,
                            "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario",
                            "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario",
                            medidaAnchoInterior,
                            medidaAlturaInterior);
                } else {
                    addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            }
        } else {
            if (modelo == DoorModel.VENECIANA) {
                addMarcoInteriorVeneciana(items,
                        "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario",
                        "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario",
                        medidaAnchoInterior,
                        medidaAlturaInterior);
            } else if (perfilPuerta == 50) {
                addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto", 2, alto);
                addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            } else {
                addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto", 2, alto);
                addMarcoInterior(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            }
        }

        addLamas(items, modelo, numeroDeLamasEntero, lamaRestante, medidaAnchoInterior - holguraLamasHorizontal, uInfo);

        if (refuerzo) {
            if (modelo == DoorModel.INOX) {
                addItem(items, "Tubo 50x50 Refuerzo Motor Inoxidable", 1, medidaAnchoInterior + 80);
            } else {
                addItem(items, "Tubo 40x15 Refuerzo Motor", 1, medidaAnchoInterior - restaRefuerzoMotor);
            }
        }

        return items;
    }

    private List<CutlistLine> generateAbatibleDos(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        int holguraSuelo = request.getGroundClearanceMm();
        int holgura = 24;
        int holguraLamasVertical = 125;
        int holguraLamasHorizontal = 125;
        int perfilPuerta = request.getLargueroMm();
        boolean marcoSuperior = Boolean.TRUE.equals(request.getTopFrame());
        boolean refuerzo = Boolean.TRUE.equals(request.getAutomationReinforcement());
        DoorModel modelo = request.getModel();
        int restaRefuerzoMotor = 160;

        int lama = lamaForModelo(modelo);
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

        UnevennessInfo uInfo = getUnevenness(request);

        if (marcoSuperior) {
            if (uInfo.present) {
                if (perfilPuerta == 50) {
                    addItem(items, "Larguero Vertical Izq 50x50 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoIzq);
                    addItem(items, "Larguero Vertical Der 50x50 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoDer);
                    addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete " + uInfo.angleStr + " Contrario", 1, uInfo.anchoInclinado);
                    addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                } else {
                    addItem(items, "Larguero Vertical Izq 50x80 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoIzq);
                    addItem(items, "Larguero Vertical Der 50x80 con pestaña con corte recto e inglete " + uInfo.angleStr, 1, uInfo.altoDer);
                    addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte inglete " + uInfo.angleStr + " Contrario", 1, uInfo.anchoInclinado);
                    addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            } else {
                if (perfilPuerta == 50) {
                    addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto e inglete 45º", 2, alto);
                    addItem(items, "Larguero Horizontal Sup 50x50 con pestaña con corte recto inglete 45º Contrario", 1, ancho);
                    addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                } else {
                    addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto e inglete 45º", 2, alto);
                    addItem(items, "Larguero Horizontal Sup 50x80 con pestaña con corte inglete 45º Contrario", 1, ancho);
                    addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
                }
            }
        } else {
            if (perfilPuerta == 50) {
                addItem(items, "Larguero Vertical 50x50 con pestaña con corte recto", 2, alto);
                addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            } else {
                addItem(items, "Larguero Vertical 50x80 con pestaña con corte recto", 2, alto);
                addMarcoInteriorDoble(items, modelo, medidaAnchoInterior, medidaAlturaInterior);
            }
        }

        addLamasDoble(items, modelo, numeroDeLamasEntero, lamaRestante,
                (medidaAnchoInterior / 2.0) - holguraLamasHorizontal, uInfo);

        if (refuerzo) {
            if (modelo == DoorModel.INOX) {
                addItem(items, "Tubo 50x50 Refuerzo Motor Inoxidable", 2, (medidaAnchoInterior / 2.0) + 80);
            } else {
                addItem(items, "Tubo 40x15 Refuerzo Motor", 2, (medidaAnchoInterior - (restaRefuerzoMotor * 2)) / 2.0);
            }
        }

        return items;
    }

    private List<CutlistLine> generateCorredera(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        DoorModel modelo = request.getModel();
        boolean refuerzo = Boolean.TRUE.equals(request.getAutomationReinforcement());
        boolean cola = Boolean.TRUE.equals(request.getTail());
        RailType carrilTipo = request.getRailType();
        MountingType montaje = request.getMountingType();
        int restaRefuerzoMotor = 160;
        int lama = lamaForModelo(modelo);

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
            addItem(items, "Marco Superior 50x50", 1, marcoSuperior);
            addItem(items, "Marco de cierre 50x50 Ranura", 1, marcoCierre);
        } else if (modelo == DoorModel.INOX) {
            addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, ancho);
            addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, marcoCierre);
            addItem(items, "Cola Superior 80x50 con corte recto 90º", 1, 250);
        } else {
            addItem(items, "Marco Superior 80x50 Ranura", 1, marcoSuperior);
            addItem(items, "Marco de cierre 80x50 Ranura", 1, marcoCierre);
        }

        if (cola) {
            if (modelo == DoorModel.VENECIANA) {
                addItem(items, "Marco Inferior 50x50 Ranura", 1, marcoSuperior);
                addItem(items, "Marco Posterior 50x50 Ranura", 1, marcoPosterior);
            } else if (modelo == DoorModel.INOX) {
                addItem(items, "Cola Motor 80x50 con corte recto 90º", 1, 250);
            } else {
                addItem(items, "Marco Inferior 80x50 Ranura", 1, marcoSuperior);
                addItem(items, "Marco Posterior 80x50 Ranura", 1, marcoPosterior);
            }
        } else {
            if (modelo != DoorModel.INOX) {
                addItem(items, "Marco Inferior 80x50 Inglete Contrario", 1, marcoSuperior - 250);
                addItem(items, "Marco Posterior 80x50 Ranura Inglete Contrario", 1, marcoCierre - 80);
            }
        }

        addItem(items, "Perfil Ruedas Correderas Corte Recto", 1, marcoSuperior - 5);

        if (modelo == DoorModel.PREMIUM) {
            addItem(items, "Lama 200x20 corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x20 corte recto", 1,
                        lamaRestante + "mm X " + medidaAnchoInterior);
            }
        } else if (modelo == DoorModel.CLASSIC) {
            addItem(items, "Lama 100x20 corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100x20 corte recto", 1,
                        lamaRestante + "mm X " + medidaAnchoInterior);
            }
        } else if (modelo == DoorModel.INOX) {
            addItem(items, "Lama 200x26 corte recto", numeroDeLamasEntero, ancho - 160);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x26 corte recto", 1, lamaRestante + "mm X " + (ancho - 160));
            }
            addItem(items, "Tubo Inoxidable 60x20 corte recto", numeroDeLamasEntero, ancho - 160);
        } else if (modelo == DoorModel.VENECIANA) {
            addItem(items, "Lama 100 Avión corte recto", numeroDeLamasEntero, medidaAnchoInterior);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100 Avión corte recto", 1,
                        lamaRestante + "mm X " + medidaAnchoInterior);
            }
        }

        if (montaje == MountingType.A) {
            addItem(items, "Poste de cierre sin pestañas", 1, alto);
        } else if (montaje == MountingType.B) {
            addItem(items, "Poste de cierre con pestañas", 1, alto);
        }

        if (refuerzo) {
            if (modelo == DoorModel.INOX) {
                addItem(items, "Tubo 50x50 Refuerzo Motor Inoxidable", 1, ancho + 310);
            } else {
                addItem(items, "Tubo 40x15 Refuerzo Motor", 1, medidaAnchoInterior - restaRefuerzoMotor);
            }
        }

        return items;
    }

    private List<CutlistLine> generateValla(CutlistRequestDto request) {
        int ancho = request.getWidthMm();
        int alto = request.getHeightMm();
        DoorModel modelo = request.getModel();

        int holguraLamasVertical = 125;
        int holguraLamasHorizontal = 125;
        int lama = lamaForModelo(modelo);

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
            addItem(items, "Marco Horizontal 50x50 con corte inglete 45º Contrario", 2, ancho);
            addItem(items, "Marco Vertical 50x50 con corte inglete troquelado 45º Contrario", 2, alto);
        } else if (modelo == DoorModel.INOX) {
            addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, alto);
            addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, ancho);
        } else {
            addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 2, alto);
            addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 2, ancho);
        }

        addLamas(items, modelo, numeroDeLamasEntero, lamaRestante, medidaAnchoInterior, getUnevenness(request));

        return items;
    }

    private int lamaForModelo(DoorModel modelo) {
        return switch (modelo) {
            case PREMIUM -> 200;
            case CLASSIC -> 100;
            case INOX -> 216;
            case VENECIANA -> 95;
        };
    }

    private void addMarcoInterior(List<CutlistLine> items, DoorModel modelo, int medidaAnchoInterior,
            int medidaAlturaInterior) {
        if (modelo == DoorModel.INOX) {
            addItem(items, "Marco Horizontal Inox 100x50 con corte inglete 45º Contrario", 2, medidaAnchoInterior);
            addItem(items, "Marco Vertical Inox 100x50 con corte inglete 45º Contrario", 2, medidaAlturaInterior);
        } else {
            addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 2, medidaAnchoInterior);
            addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 2, medidaAlturaInterior);
        }
    }

    private void addMarcoInteriorVeneciana(List<CutlistLine> items, String horizontalDesc, String verticalDesc,
            double medidaAnchoInterior, double medidaAlturaInterior) {
        addItem(items, horizontalDesc, 2, medidaAnchoInterior);
        addItem(items, verticalDesc, 2, medidaAlturaInterior);
    }

    private void addMarcoInteriorDoble(List<CutlistLine> items, DoorModel modelo, int medidaAnchoInterior,
            int medidaAlturaInterior) {
        if (modelo == DoorModel.VENECIANA) {
            addItem(items, "Marco Horizontal 50x50 troquelado con corte inglete 45º Contrario", 2,
                    medidaAnchoInterior / 2.0);
            addItem(items, "Marco Vertical 50x50 troquelado con corte inglete 45º Contrario", 2, medidaAlturaInterior);
        } else if (modelo == DoorModel.INOX) {
            addItem(items, "Marco Horizontal 80x50 con corte inglete 45º Contrario", 4, medidaAnchoInterior / 2.0);
            addItem(items, "Marco Vertical 80x50 con corte inglete 45º Contrario", 3, medidaAlturaInterior);
            addItem(items, "Marco Vertical 80x50 y pestaña con corte inglete 45º Contrario", 1,
                    medidaAlturaInterior + 40);
        } else {
            addItem(items, "Marco Horizontal 80x50 con ranura con corte inglete 45º Contrario", 4,
                    medidaAnchoInterior / 2.0);
            addItem(items, "Marco Vertical 80x50 con ranura con corte inglete 45º Contrario", 3, medidaAlturaInterior);
            addItem(items, "Marco Vertical 80x50 con ranura y pestaña con corte inglete 45º Contrario", 1,
                    medidaAlturaInterior + 40);
        }
    }

    private void addLamas(List<CutlistLine> items, DoorModel modelo, int numeroDeLamasEntero, int lamaRestante,
            double medidaAncho, UnevennessInfo uInfo) {
        int lamaSize = lamaForModelo(modelo);
        if (uInfo != null && uInfo.present && lamaRestante == 0 && numeroDeLamasEntero > 0) {
            lamaRestante = lamaSize;
            numeroDeLamasEntero -= 1;
        }
        String corteAdicional;
        if (uInfo != null && uInfo.present) {
            long drop = Math.round(medidaAncho * uInfo.tanSlope);
            long parteInferior = Math.max(0, lamaRestante - drop);
            corteAdicional = String.format("corte inglete %s (superior: %dmm, inferior: %dmm)", uInfo.angleStr, lamaRestante, parteInferior);
        } else {
            corteAdicional = "corte recto";
        }
        if (modelo == DoorModel.PREMIUM) {
            addItem(items, "Lama 200x20 corte recto", numeroDeLamasEntero, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x20 " + corteAdicional, 1,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        } else if (modelo == DoorModel.CLASSIC) {
            addItem(items, "Lama 100x20 corte recto", numeroDeLamasEntero, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100x20 " + corteAdicional, 1,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        } else if (modelo == DoorModel.INOX) {
            double medidaAnchoInox = medidaAncho - 35;
            addItem(items, "Lama 200x26 corte recto", numeroDeLamasEntero, medidaAnchoInox);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x26 " + corteAdicional, 1,
                        lamaRestante + "mm X " + formatNumber(medidaAnchoInox));
            }
            addItem(items, "Tubo Inoxidable 60x20 corte recto", numeroDeLamasEntero, medidaAnchoInox);
        } else if (modelo == DoorModel.VENECIANA) {
            addItem(items, "Lama 100 Avión corte recto", numeroDeLamasEntero, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100 Avión " + corteAdicional, 1,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        }
    }

    private void addLamasDoble(List<CutlistLine> items, DoorModel modelo, int numeroDeLamasEntero, int lamaRestante,
            double medidaAncho, UnevennessInfo uInfo) {
        int lamaSize = lamaForModelo(modelo);
        if (uInfo != null && uInfo.present && lamaRestante == 0 && numeroDeLamasEntero > 0) {
            lamaRestante = lamaSize;
            numeroDeLamasEntero -= 1;
        }
        String corteAdicional;
        if (uInfo != null && uInfo.present) {
            long drop = Math.round(medidaAncho * uInfo.tanSlope);
            long parteInferior = Math.max(0, lamaRestante - drop);
            corteAdicional = String.format("corte inglete %s (superior: %dmm, inferior: %dmm)", uInfo.angleStr, lamaRestante, parteInferior);
        } else {
            corteAdicional = "corte recto";
        }
        int totalLamas = numeroDeLamasEntero * 2;
        if (modelo == DoorModel.PREMIUM) {
            addItem(items, "Lama 200x20 corte recto", totalLamas, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x20 " + corteAdicional, 2,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        } else if (modelo == DoorModel.CLASSIC) {
            addItem(items, "Lama 100x20 corte recto", totalLamas, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100x20 " + corteAdicional, 2,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        } else if (modelo == DoorModel.INOX) {
            double medidaAnchoInox = medidaAncho - 35;
            addItem(items, "Lama 200x26 corte recto", totalLamas, medidaAnchoInox);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 200x26 corte recto", 2,
                        lamaRestante + "mm X " + formatNumber(medidaAnchoInox));
            }
            addItem(items, "Tubo Inoxidable 60x20 corte recto", totalLamas, medidaAnchoInox);
        } else if (modelo == DoorModel.VENECIANA) {
            addItem(items, "Lama 100 Avión corte recto", totalLamas, medidaAncho);
            if (lamaRestante > 0) {
                addItem(items, "Lama adicional Lama 100 Avión corte recto", 2,
                        lamaRestante + "mm X " + formatNumber(medidaAncho));
            }
        }
    }

    private void addItem(List<CutlistLine> items, String description, int units, Object measure) {
        items.add(new CutlistLine(description, units, formatMeasure(measure)));
    }

    private String formatMeasure(Object measure) {
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

    private String formatNumber(double value) {
        return BigDecimal.valueOf(value).stripTrailingZeros().toPlainString();
    }
}
