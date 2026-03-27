package com.aluon.production.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import com.aluon.production.budget.model.BudgetValidation;
import com.aluon.production.budget.model.BudgetValidationStatus;


public interface BudgetValidationRepository extends JpaRepository<BudgetValidation, UUID> {
    List<BudgetValidation> findByStatus(BudgetValidationStatus status);
    Optional<BudgetValidation> findByBudgetNumber(String budgetNumber);
}
