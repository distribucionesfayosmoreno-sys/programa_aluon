package com.aluon.production.cutlist.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.aluon.production.cutlist.model.DoorModel;
import com.aluon.production.cutlist.model.DoorType;
import com.aluon.production.cutlist.model.HingesSide;
import com.aluon.production.cutlist.model.MountingType;
import com.aluon.production.cutlist.model.OpeningSide;
import com.aluon.production.cutlist.model.RailType;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CutlistResponseDto {
    private UUID id;
    private String distributor;
    private String budgetNumber;
    private LocalDate budgetDate;
    private String color;
    private String installerName;
    private DoorType doorType;
    private DoorModel model;
    private Integer widthMm;
    private Integer heightMm;
    private Integer heightLeftMm;
    private Integer heightRightMm;
    private Integer widthLeftMm;
    private Integer widthRightMm;
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
    private LocalDateTime createdAt;
    private List<CutlistItemDto> items;
}
