package com.aluon.production.order.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusDto {
    private UUID id;
    private String codigoOrden;
    private OrderStatus estado;
    private OrderWorkflowStep workflowStep;
    private String customerName;
}
