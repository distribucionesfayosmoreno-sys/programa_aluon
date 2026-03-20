package com.aluon.production.cutlist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CutlistRequestDto {
    private DoorType doorType;
    private DoorModel model;
    private Integer widthMm;
    private Integer heightMm;
    private Integer groundClearanceMm;
    private Integer largueroMm;
    private Boolean topFrame;
    private Boolean automationReinforcement;
    private RailType railType;
    private MountingType mountingType;
    private Boolean tail;
    private String notes;
}
