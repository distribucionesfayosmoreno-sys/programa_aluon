package com.aluon.crm.quote.dto;

import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QuoteItemRequest {
    private DoorModel doorModel;
    private DoorType doorType;
    private Integer widthMm;
    private Integer heightMm;
}
