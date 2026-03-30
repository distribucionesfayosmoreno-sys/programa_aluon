package com.aluon.production.order.dto;

import com.aluon.production.order.model.OrderWorkflowStep;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderWorkflowUpdateRequest {
    private OrderWorkflowStep workflowStep;
    private String authorizerUserId;
}
