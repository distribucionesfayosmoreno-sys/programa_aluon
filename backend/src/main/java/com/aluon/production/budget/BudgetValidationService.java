package com.aluon.production.budget;

import com.aluon.core.user.Role;
import com.aluon.core.user.User;
import com.aluon.core.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetValidationService {

    private final BudgetValidationRepository budgetValidationRepository;
    private final UserRepository userRepository;

    @Transactional
    public BudgetValidationDto create(BudgetValidationCreateRequest request) {
        validateCreate(request);

        BudgetValidation budget = BudgetValidation.builder()
                .budgetNumber(request.getBudgetNumber().trim())
                .requestId(request.getRequestId().trim())
                .customerName(request.getCustomerName().trim())
                .modelLabel(request.getModelLabel())
                .m2(request.getM2())
                .total(request.getTotal())
                .status(BudgetValidationStatus.PENDIENTE)
                .createdAt(LocalDateTime.now())
                .build();

        BudgetValidation saved = budgetValidationRepository.save(budget);
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
        if (request == null || request.getUserId() == null) {
            throw new IllegalArgumentException("El usuario aprobador es obligatorio");
        }

        BudgetValidation budget = budgetValidationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Presupuesto no encontrado"));

        if (budget.getStatus() == BudgetValidationStatus.APROBADO) {
            return toDto(budget);
        }

        User approver = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario aprobador no encontrado"));

        if (approver.getRol() != Role.ADMIN && approver.getRol() != Role.DIOS) {
            throw new IllegalArgumentException("Solo ADMIN o DIOS pueden aprobar presupuestos");
        }

        budget.setStatus(BudgetValidationStatus.APROBADO);
        budget.setApprovedAt(LocalDateTime.now());
        budget.setApprovedBy(approver);

        return toDto(budgetValidationRepository.save(budget));
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
}
