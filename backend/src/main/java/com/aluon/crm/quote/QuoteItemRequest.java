package com.aluon.crm.quote;

import com.aluon.production.cutlist.DoorModel;
import com.aluon.production.cutlist.DoorType;
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
