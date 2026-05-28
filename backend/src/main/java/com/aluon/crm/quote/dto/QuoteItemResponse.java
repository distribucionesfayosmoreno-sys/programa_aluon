package com.aluon.crm.quote.dto;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class QuoteItemResponse {
    private DoorModel doorModel;
    private DoorType doorType;
    private ProductCategory productCategory;
    private String colorCode;
    private Boolean primerRequired;
    private DoorType openingVariant;
    private Integer widthMm;
    private Integer heightMm;
    private Integer floorClearanceMm;
    private Boolean larguero;
    private Boolean marcoSuperior;
    private Boolean bisagras;
    private Boolean porteroAutomatico;
    private BigDecimal m2;
    private BigDecimal pricePerM2;
    private BigDecimal lineTotal;
}
