package com.aluon.crm.documents.controller;

import com.aluon.crm.documents.dto.DocumentManagementRowResponse;
import com.aluon.crm.documents.service.DocumentManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/document-management")
@RequiredArgsConstructor
public class DocumentManagementController {

    private final DocumentManagementService documentManagementService;

    @GetMapping("/rows")
    public ResponseEntity<List<DocumentManagementRowResponse>> listRows(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) LocalDate dateFrom,
            @RequestParam(required = false) LocalDate dateTo
    ) {
        return ResponseEntity.ok(documentManagementService.listRows(query, type, status, dateFrom, dateTo));
    }
}

