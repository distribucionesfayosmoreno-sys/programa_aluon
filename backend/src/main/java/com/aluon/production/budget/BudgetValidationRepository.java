package com.aluon.production.budget;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BudgetValidationRepository extends JpaRepository<BudgetValidation, UUID> {
    List<BudgetValidation> findByStatus(BudgetValidationStatus status);
}
