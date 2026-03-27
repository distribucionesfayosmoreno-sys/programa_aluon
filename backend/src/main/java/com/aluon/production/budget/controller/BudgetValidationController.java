package com.aluon.production.budget.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.aluon.production.budget.dto.BudgetValidationApprovalRequest;
import com.aluon.production.budget.dto.BudgetValidationCreateRequest;
import com.aluon.production.budget.dto.BudgetValidationDto;
import com.aluon.production.budget.service.BudgetValidationService;


@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetValidationController {

    private final BudgetValidationService budgetValidationService;

    @PostMapping
    public ResponseEntity<BudgetValidationDto> create(@RequestBody BudgetValidationCreateRequest request) {
        return ResponseEntity.ok(budgetValidationService.create(request));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<BudgetValidationDto>> listPending() {
        return ResponseEntity.ok(budgetValidationService.listPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<BudgetValidationDto> approve(@PathVariable UUID id, @RequestBody BudgetValidationApprovalRequest request) {
        return ResponseEntity.ok(budgetValidationService.approve(id, request));
    }
}
