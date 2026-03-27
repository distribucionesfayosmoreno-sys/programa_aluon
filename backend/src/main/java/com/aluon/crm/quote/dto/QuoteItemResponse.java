package com.aluon.crm.quote.dto;

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
    private Integer widthMm;
    private Integer heightMm;
    private BigDecimal m2;
    private BigDecimal pricePerM2;
    private BigDecimal lineTotal;
}
