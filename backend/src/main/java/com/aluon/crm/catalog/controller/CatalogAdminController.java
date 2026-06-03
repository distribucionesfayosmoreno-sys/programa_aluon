package com.aluon.crm.catalog.controller;

import com.aluon.crm.catalog.dto.CatalogAdminChildResponse;
import com.aluon.crm.catalog.dto.CatalogAdminFamilyResponse;
import com.aluon.crm.catalog.dto.CatalogChildUpsertRequest;
import com.aluon.crm.catalog.dto.CatalogFamilyUpsertRequest;
import com.aluon.crm.catalog.service.CatalogAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/catalog")
@RequiredArgsConstructor
public class CatalogAdminController {

    private final CatalogAdminService catalogAdminService;

    @GetMapping("/families")
    public ResponseEntity<List<CatalogAdminFamilyResponse>> listFamilies() {
        return ResponseEntity.ok(catalogAdminService.listFamilies());
    }

    @PostMapping("/families")
    public ResponseEntity<CatalogAdminFamilyResponse> createFamily(@Valid @RequestBody CatalogFamilyUpsertRequest request) {
        return ResponseEntity.ok(catalogAdminService.createFamily(request));
    }

    @PutMapping("/families/{familyId}")
    public ResponseEntity<CatalogAdminFamilyResponse> updateFamily(
            @PathVariable UUID familyId,
            @Valid @RequestBody CatalogFamilyUpsertRequest request
    ) {
        return ResponseEntity.ok(catalogAdminService.updateFamily(familyId, request));
    }

    @DeleteMapping("/families/{familyId}")
    public ResponseEntity<Void> deleteFamily(@PathVariable UUID familyId) {
        catalogAdminService.deleteFamily(familyId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/children")
    public ResponseEntity<CatalogAdminChildResponse> createChild(@Valid @RequestBody CatalogChildUpsertRequest request) {
        return ResponseEntity.ok(catalogAdminService.createChild(request));
    }

    @PutMapping("/children/{childId}")
    public ResponseEntity<CatalogAdminChildResponse> updateChild(
            @PathVariable UUID childId,
            @Valid @RequestBody CatalogChildUpsertRequest request
    ) {
        return ResponseEntity.ok(catalogAdminService.updateChild(childId, request));
    }

    @DeleteMapping("/children/{childId}")
    public ResponseEntity<Void> deleteChild(@PathVariable UUID childId) {
        catalogAdminService.deleteChild(childId);
        return ResponseEntity.noContent().build();
    }
}
