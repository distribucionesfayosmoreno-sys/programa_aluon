package com.aluon.crm.catalog.porton;

/** Technical reference attached to a quote line; it does not override ALUON tariffs. */
public record PortonConfiguration(
        String variantCode,
        String panelCode,
        String orientation,
        String finishCode,
        String customRal,
        boolean motorized,
        boolean safetyPhotocell,
        boolean safetyEdge,
        String guide,
        String closingProfile
) {}
