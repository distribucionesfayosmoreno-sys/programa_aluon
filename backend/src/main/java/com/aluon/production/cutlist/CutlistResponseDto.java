package com.aluon.production.cutlist;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CutlistResponseDto {
    private UUID id;
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
    private LocalDateTime createdAt;
    private List<CutlistItemDto> items;
}
