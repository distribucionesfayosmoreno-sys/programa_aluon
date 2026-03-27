package com.aluon.erp.budget.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aluon.erp.budget.service.ErpBudgetService;
import com.aluon.erp.budget.dto.ErpBudgetStatusResponse;
import com.aluon.erp.budget.dto.ErpBudgetSyncRequest;


@RestController
@RequestMapping("/api/erp/budgets")
@RequiredArgsConstructor
public class ErpBudgetController {

    private final ErpBudgetService erpBudgetService;

    @GetMapping("/{quoteNumber}/status")
    public ResponseEntity<ErpBudgetStatusResponse> getStatus(@PathVariable String quoteNumber) {
        return ResponseEntity.ok(erpBudgetService.getStatus(quoteNumber));
    }

    @PostMapping("/sync")
    public ResponseEntity<ErpBudgetStatusResponse> sync(@RequestBody ErpBudgetSyncRequest request) {
        return ResponseEntity.ok(erpBudgetService.sync(request));
    }
}
