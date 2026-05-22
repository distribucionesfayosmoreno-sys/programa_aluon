package com.aluon.production.order.service;

import com.aluon.production.order.model.Order;
import com.aluon.production.order.model.OrderWorkflowStep;
import com.aluon.production.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * Domain component responsible for workflow step ordering logic.
 * Centralises isForwardTransition, isBackwardTransition, and order resolution
 * so that OrderService and CutlistService share a single source of truth.
 */
@Component
@RequiredArgsConstructor
public class WorkflowProgressService {

    /** Canonical ordered list of workflow steps. */
    static final List<OrderWorkflowStep> STEP_ORDER = List.of(
            OrderWorkflowStep.INBOX,
            OrderWorkflowStep.REQUEST,
            OrderWorkflowStep.BUDGET,
            OrderWorkflowStep.VALIDATION,
            OrderWorkflowStep.DEV,
            OrderWorkflowStep.PROD,
            OrderWorkflowStep.FINAL
    );

    private final OrderRepository orderRepository;

    /**
     * Returns {@code true} if transitioning from {@code current} to {@code next}
     * advances the workflow (next has a higher index than current).
     */
    public boolean isForwardTransition(OrderWorkflowStep current, OrderWorkflowStep next) {
        int currentIndex = STEP_ORDER.indexOf(current);
        int nextIndex = STEP_ORDER.indexOf(next);
        if (currentIndex == -1 || nextIndex == -1) {
            return false;
        }
        return nextIndex > currentIndex;
    }

    /**
     * Returns {@code true} if transitioning from {@code current} to {@code next}
     * reverts the workflow (next has a lower index than current).
     */
    public boolean isBackwardTransition(OrderWorkflowStep current, OrderWorkflowStep next) {
        int currentIndex = STEP_ORDER.indexOf(current);
        int nextIndex = STEP_ORDER.indexOf(next);
        if (currentIndex == -1 || nextIndex == -1) {
            return false;
        }
        return nextIndex < currentIndex;
    }

    /**
     * Resolves an {@link Order} by UUID or by {@code codigoOrden}.
     * Returns {@code null} if no order is found.
     */
    public Order resolveOrder(String requestId) {
        if (requestId == null || requestId.isBlank()) {
            return null;
        }
        try {
            UUID orderId = UUID.fromString(requestId.trim());
            return orderRepository.findById(Objects.requireNonNull(orderId)).orElse(null);
        } catch (IllegalArgumentException ignored) {
            return orderRepository.findByCodigoOrden(requestId.trim()).orElse(null);
        }
    }
}
