package com.aluon.crm.catalog.service;

import java.math.BigDecimal;

public record CatalogDoorPricingResult(
        BigDecimal m2,
        BigDecimal pricePerM2,
        boolean catalogPriceUsed
) {
}
