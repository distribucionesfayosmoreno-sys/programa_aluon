package com.aluon.production.order.repository;

import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;
import org.junit.jupiter.api.Test;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.data.projection.SpelAwareProxyProjectionFactory;

import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class OrderRepositoryProjectionsTest {

    private final ProjectionFactory projectionFactory = new SpelAwareProxyProjectionFactory();

    @Test
    void orderStepCountRow_uses_accessor_methods() {
        OrderRepository.OrderStepCountRow row = projectionFactory.createProjection(
                OrderRepository.OrderStepCountRow.class,
                Map.of(
                        "step", OrderWorkflowStep.INBOX,
                        "count", 3L
                )
        );

        assertThat(row.getStep()).isEqualTo(OrderWorkflowStep.INBOX);
        assertThat(row.getCount()).isEqualTo(3L);
    }

    @Test
    void orderStatusCountRow_uses_accessor_methods() {
        OrderRepository.OrderStatusCountRow row = projectionFactory.createProjection(
                OrderRepository.OrderStatusCountRow.class,
                Map.of(
                        "status", OrderStatus.PRESUPUESTO,
                        "count", 7L
                )
        );

        assertThat(row.getStatus()).isEqualTo(OrderStatus.PRESUPUESTO);
        assertThat(row.getCount()).isEqualTo(7L);
    }

    @Test
    void recentOrderRow_uses_accessor_methods() {
        LocalDateTime createdAt = LocalDateTime.parse("2026-06-01T00:00:00");

        OrderRepository.RecentOrderRow row = projectionFactory.createProjection(
                OrderRepository.RecentOrderRow.class,
                Map.of(
                        "codigoOrden", "O-0001",
                        "status", OrderStatus.PRESUPUESTO,
                        "workflowStage", "INBOX",
                        "customerName", "Cliente Demo",
                        "createdAt", createdAt,
                        "assignedUserName", "Operario"
                )
        );

        assertThat(row.getCodigoOrden()).isEqualTo("O-0001");
        assertThat(row.getStatus()).isEqualTo(OrderStatus.PRESUPUESTO);
        assertThat(row.getWorkflowStage()).isEqualTo("INBOX");
        assertThat(row.getCustomerName()).isEqualTo("Cliente Demo");
        assertThat(row.getCreatedAt()).isEqualTo(createdAt);
        assertThat(row.getAssignedUserName()).isEqualTo("Operario");
    }
}
