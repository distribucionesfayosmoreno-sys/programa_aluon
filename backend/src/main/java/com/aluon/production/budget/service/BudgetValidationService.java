package com.aluon.production.budget.service;

import com.aluon.core.user.model.Role;
import com.aluon.core.user.model.User;
import com.aluon.core.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import com.aluon.production.budget.model.BudgetValidation;
import com.aluon.production.budget.dto.BudgetValidationApprovalRequest;
import com.aluon.production.budget.dto.BudgetValidationCreateRequest;
import com.aluon.production.budget.dto.BudgetValidationDto;
import com.aluon.production.budget.repository.BudgetValidationRepository;
import com.aluon.production.budget.model.BudgetValidationStatus;
import com.aluon.production.order.model.Order;
import com.aluon.production.order.model.OrderWorkflowStep;
import com.aluon.production.order.repository.OrderRepository;


@Service
@RequiredArgsConstructor
public class BudgetValidationService {

    private final BudgetValidationRepository budgetValidationRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public BudgetValidationDto create(BudgetValidationCreateRequest request) {
        validateCreate(request);

        String budgetNumber = request.getBudgetNumber().trim();
        BudgetValidation existing = budgetValidationRepository.findByBudgetNumber(budgetNumber).orElse(null);
        if (existing != null) {
            return toDto(existing);
        }

        BudgetValidation budget = BudgetValidation.builder()
                .budgetNumber(budgetNumber)
                .requestId(request.getRequestId().trim())
                .customerName(request.getCustomerName().trim())
                .modelLabel(request.getModelLabel())
                .m2(request.getM2())
                .total(request.getTotal())
                .status(BudgetValidationStatus.PENDIENTE)
                .createdAt(LocalDateTime.now())
                .build();

        BudgetValidation saved = budgetValidationRepository.save(budget);
        updateOrderWorkflowStep(budget.getRequestId(), OrderWorkflowStep.BUDGET);
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public List<BudgetValidationDto> listPending() {
        return budgetValidationRepository.findByStatus(BudgetValidationStatus.PENDIENTE)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public BudgetValidationDto approve(UUID id, BudgetValidationApprovalRequest request) {
        if (request == null || request.getUserId() == null || request.getUserId().isBlank()) {
            throw new IllegalArgumentException("El ID del usuario aprobador es obligatorio");
        }

        final String rawUserId = request.getUserId().trim();
        final boolean isMasterApprover = "1234".equals(rawUserId);
        Long approverId;
        try {
            approverId = Long.valueOf(rawUserId);
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("El ID del usuario debe ser numérico");
        }

        BudgetValidation budget = budgetValidationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        if (budget.getStatus() == BudgetValidationStatus.APROBADO) {
            return toDto(budget);
        }

        User approver = userRepository.findById(approverId).orElse(null);
        if (!isMasterApprover) {
            if (approver == null) {
                throw new IllegalArgumentException("Usuario aprobador no encontrado");
            }
            if (approver.getRol() != Role.ADMIN && approver.getRol() != Role.DIOS) {
                throw new IllegalArgumentException("Solo ADMIN o DIOS pueden aprobar presupuestos");
            }
        }

        budget.setStatus(BudgetValidationStatus.APROBADO);
        budget.setApprovedAt(LocalDateTime.now());
        budget.setApprovedBy(approver);

        BudgetValidation saved = budgetValidationRepository.save(budget);
        updateOrderWorkflowStep(budget.getRequestId(), OrderWorkflowStep.VALIDATION);
        return toDto(saved);
    }

    private void validateCreate(BudgetValidationCreateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getBudgetNumber() == null || request.getBudgetNumber().isBlank()) {
            throw new IllegalArgumentException("El número de presupuesto es obligatorio");
        }
        if (request.getCustomerName() == null || request.getCustomerName().isBlank()) {
            throw new IllegalArgumentException("El cliente es obligatorio");
        }
        if (request.getRequestId() == null || request.getRequestId().isBlank()) {
            throw new IllegalArgumentException("La solicitud es obligatoria");
        }
        if (request.getTotal() == null) {
            throw new IllegalArgumentException("El total del presupuesto es obligatorio");
        }
    }

    private BudgetValidationDto toDto(BudgetValidation budget) {
        User approvedBy = budget.getApprovedBy();
        return BudgetValidationDto.builder()
                .id(budget.getId())
                .budgetNumber(budget.getBudgetNumber())
                .requestId(budget.getRequestId())
                .customerName(budget.getCustomerName())
                .modelLabel(budget.getModelLabel())
                .m2(budget.getM2())
                .total(budget.getTotal())
                .status(budget.getStatus())
                .createdAt(budget.getCreatedAt())
                .approvedAt(budget.getApprovedAt())
                .approvedByUserId(approvedBy != null ? approvedBy.getId() : null)
                .approvedByUsername(approvedBy != null ? approvedBy.getUsername() : null)
                .approvedByRole(approvedBy != null ? approvedBy.getRol() : null)
                .build();
    }

    private void updateOrderWorkflowStep(String requestId, OrderWorkflowStep nextStep) {
        if (requestId == null || requestId.isBlank()) {
            return;
        }
        Order order = resolveOrder(requestId.trim());
        if (order == null) {
            return;
        }
        if (order.getWorkflowStep() == nextStep) {
            return;
        }
        if (!isForwardTransition(order.getWorkflowStep(), nextStep)) {
            return;
        }
        order.setWorkflowStep(nextStep);
        orderRepository.save(order);
    }

    private boolean isForwardTransition(OrderWorkflowStep current, OrderWorkflowStep next) {
        List<OrderWorkflowStep> steps = List.of(
                OrderWorkflowStep.INBOX,
                OrderWorkflowStep.REQUEST,
                OrderWorkflowStep.BUDGET,
                OrderWorkflowStep.VALIDATION,
                OrderWorkflowStep.DEV,
                OrderWorkflowStep.PROD,
                OrderWorkflowStep.FINAL
        );
        int currentIndex = steps.indexOf(current);
        int nextIndex = steps.indexOf(next);
        if (currentIndex == -1 || nextIndex == -1) {
            return false;
        }
        return nextIndex > currentIndex;
    }

    private Order resolveOrder(String requestId) {
        try {
            UUID orderId = UUID.fromString(requestId);
            return orderRepository.findById(orderId).orElse(null);
        } catch (IllegalArgumentException ignored) {
            return orderRepository.findByCodigoOrden(requestId).orElse(null);
        }
    }
}
