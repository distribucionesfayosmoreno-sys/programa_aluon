package com.aluon.production.station.model;

/**
 * Códigos de las estaciones de la cadena de montaje.
 * El orden secuencial es obligatorio: cada estación requiere
 * la anterior completada para poder iniciarse.
 */
public enum ProductionStationCode {

    CORTE(1, "Corte"),
    SOLDADURA(2, "Soldadura"),
    MECANIZADO(3, "Mecanizado"),
    LACADO(4, "Lacado"),
    CONTROL_LACADO(5, "Control lacado"),
    ENSAMBLAJE(6, "Ensamblaje"),
    CONTROL_CALIDAD(7, "Control calidad");

    private final int sequenceOrder;
    private final String label;

    ProductionStationCode(int sequenceOrder, String label) {
        this.sequenceOrder = sequenceOrder;
        this.label = label;
    }

    public int getSequenceOrder() {
        return sequenceOrder;
    }

    public String getLabel() {
        return label;
    }
}
