package com.aluon.dashboard.api;

import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

public record DashboardWorkflowResponse(
        OffsetDateTime updatedAt,
        Budgets budgets,
        Orders orders
) {
    public record Budgets(
            List<BudgetCount> counts,
            List<BudgetRow> recent
    ) {
    }

    public record BudgetCount(
            QuoteStatus status,
            long count
    ) {
    }

    public record BudgetRow(
            String quoteNumber,
            QuoteStatus status,
            String customerName,
            BigDecimal total,
            LocalDateTime createdAt
    ) {
    }

    public record Orders(
            List<OrderStepCount> byStep,
            List<OrderStatusCount> byStatus,
            List<OrderRow> recent
    ) {
    }

    public record OrderStepCount(
            OrderWorkflowStep step,
            long count
    ) {
    }

    public record OrderStatusCount(
            OrderStatus status,
            long count
    ) {
    }

    public record OrderRow(
            String codigoOrden,
            OrderStatus status,
            String workflowStage,
            String customerName,
            LocalDateTime createdAt,
            String assignedUserName
    ) {
    }
}

