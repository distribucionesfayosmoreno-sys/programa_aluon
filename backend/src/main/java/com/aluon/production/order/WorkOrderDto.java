package com.aluon.production.order;

import com.aluon.production.cutlist.DoorModel;
import com.aluon.production.cutlist.DoorType;
import com.aluon.production.cutlist.MountingType;
import com.aluon.production.cutlist.RailType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderDto {
    private UUID id;
    private String codigoOrden;
    private OrderStatus estado;
    private OrderWorkflowStep workflowStep;
    private UUID customerId;
    private String customerName;
    private String customerAddress;
    private String customerPhone;
    private String modeloPuerta;
    private Integer anchoMm;
    private Integer altoMm;
    private UUID cutlistId;
    private String distributor;
    private String budgetNumber;
    private LocalDate budgetDate;
    private String color;
    private String installerName;
    private DoorType doorType;
    private DoorModel doorModel;
    private Integer widthMm;
    private Integer heightMm;
    private Integer heightLeftMm;
    private Integer heightRightMm;
    private Integer widthLeftMm;
    private Integer widthRightMm;
    private Integer groundClearanceMm;
    private Integer largueroMm;
    private Boolean topFrame;
    private com.aluon.production.cutlist.HingesSide hingesSide;
    private Boolean porterAutomatic;
    private Boolean automationIncluded;
    private Boolean automationReinforcement;
    private com.aluon.production.cutlist.OpeningSide openingSide;
    private RailType railType;
    private MountingType mountingType;
    private Boolean tail;
    private String notes;
    private LocalDateTime createdAt;
    private List<WorkOrderItemDto> items;
}
