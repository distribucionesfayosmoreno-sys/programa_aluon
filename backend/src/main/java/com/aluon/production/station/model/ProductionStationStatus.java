package com.aluon.production.station.model;

/**
 * Estado de cada estación dentro de la cadena de montaje.
 */
public enum ProductionStationStatus {

    /** Estación pendiente de iniciar. */
    PENDING,

    /** Estación en curso (operario trabajando). */
    IN_PROGRESS,

    /** Estación completada satisfactoriamente. */
    COMPLETED,

    /** Estación bloqueada por incidencia. */
    BLOCKED,

    /** Estación omitida (no aplica a esta orden). */
    SKIPPED
}
