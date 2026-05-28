package com.aluon.crm.quote.dto;

import com.aluon.crm.catalog.model.ProductCategory;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuoteItemRequest {
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
}
