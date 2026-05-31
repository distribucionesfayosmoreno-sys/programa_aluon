package com.aluon.crm.quote.dto;

public record QuoteLifecycleNumbersResponse(
        String seriesKey,
        String presupuesto,
        String pedido,
        String albaran,
        String factura,
        String abono
) {
}

