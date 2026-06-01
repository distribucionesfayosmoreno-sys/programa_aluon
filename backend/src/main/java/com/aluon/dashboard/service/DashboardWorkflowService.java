package com.aluon.dashboard.service;

import com.aluon.crm.quote.model.QuoteStatus;
import com.aluon.crm.quote.repository.QuoteRequestRepository;
import com.aluon.dashboard.api.DashboardRange;
import com.aluon.dashboard.api.DashboardWorkflowResponse;
import com.aluon.production.order.model.OrderStatus;
import com.aluon.production.order.model.OrderWorkflowStep;
import com.aluon.production.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardWorkflowService {

    private final QuoteRequestRepository quoteRequestRepository;
    private final OrderRepository orderRepository;
    private final Clock clock = Clock.systemDefaultZone();

    public DashboardWorkflowResponse getWorkflow(DashboardRange range) {
        LocalDateTime start = range.start(clock);
        LocalDateTime end = range.endExclusive(clock);

        List<DashboardWorkflowResponse.BudgetCount> budgetCounts = List.of(QuoteStatus.values()).stream()
                .map(status -> new DashboardWorkflowResponse.BudgetCount(
                        status,
                        quoteRequestRepository.countByStatusAndCreatedAtBetween(status, start, end)
                ))
                .toList();

        var recentBudgets = quoteRequestRepository.findRecentBudgetsBetween(start, end, PageRequest.of(0, 6));
        List<DashboardWorkflowResponse.BudgetRow> budgetRows = recentBudgets.stream()
                .map(row -> new DashboardWorkflowResponse.BudgetRow(
                        row.getQuoteNumber(),
                        row.getStatus(),
                        row.getCustomerName(),
                        row.getTotal(),
                        row.getCreatedAt()
                ))
                .toList();

        Map<OrderWorkflowStep, Long> stepCounts = orderRepository.countByWorkflowStepAll().stream()
                .collect(Collectors.toMap(
                        OrderRepository.OrderStepCountRow::getStep,
                        OrderRepository.OrderStepCountRow::getCount
                ));

        List<DashboardWorkflowResponse.OrderStepCount> orderByStep = List.of(OrderWorkflowStep.values()).stream()
                .map(step -> new DashboardWorkflowResponse.OrderStepCount(step, stepCounts.getOrDefault(step, 0L)))
                .toList();

        Map<OrderStatus, Long> statusCounts = orderRepository.countByStatusAll().stream()
                .collect(Collectors.toMap(
                        OrderRepository.OrderStatusCountRow::getStatus,
                        OrderRepository.OrderStatusCountRow::getCount
                ));

        List<DashboardWorkflowResponse.OrderStatusCount> orderByStatus = List.of(OrderStatus.values()).stream()
                .map(status -> new DashboardWorkflowResponse.OrderStatusCount(status, statusCounts.getOrDefault(status, 0L)))
                .toList();

        var recentOrders = orderRepository.findRecent(PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "createdAt")));
        List<DashboardWorkflowResponse.OrderRow> orderRows = recentOrders.stream()
                .map(row -> new DashboardWorkflowResponse.OrderRow(
                        row.getCodigoOrden(),
                        row.getStatus(),
                        row.getWorkflowStage(),
                        row.getCustomerName(),
                        row.getCreatedAt(),
                        row.getAssignedUserName()
                ))
                .toList();

        return new DashboardWorkflowResponse(
                OffsetDateTime.now(ZoneOffset.UTC),
                new DashboardWorkflowResponse.Budgets(budgetCounts, budgetRows),
                new DashboardWorkflowResponse.Orders(orderByStep, orderByStatus, orderRows)
        );
    }
}
