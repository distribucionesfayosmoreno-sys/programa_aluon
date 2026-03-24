package com.aluon.production.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

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
