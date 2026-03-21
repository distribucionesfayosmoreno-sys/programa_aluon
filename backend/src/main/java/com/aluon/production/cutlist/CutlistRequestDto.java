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
    private String distributor;
    private String budgetNumber;
    private java.time.LocalDate budgetDate;
    private String color;
    private DoorType doorType;
    private DoorModel model;
    private Integer widthMm;
    private Integer heightMm;
    private Integer groundClearanceMm;
    private Integer largueroMm;
    private Boolean topFrame;
    private HingesSide hingesSide;
    private Boolean porterAutomatic;
    private Boolean automationIncluded;
    private Boolean automationReinforcement;
    private OpeningSide openingSide;
    private RailType railType;
    private MountingType mountingType;
    private Boolean tail;
    private String notes;
}
