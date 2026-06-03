package com.aluon.crm.catalog.controller;

import com.aluon.crm.catalog.dto.CatalogDoorProductResponse;
import com.aluon.crm.catalog.dto.CatalogFamilyChildResponse;
import com.aluon.crm.catalog.dto.CatalogFamilyResponse;
import com.aluon.crm.catalog.dto.CatalogProductModelResponse;
import com.aluon.crm.catalog.dto.CatalogProductVariantResponse;
import com.aluon.crm.catalog.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalog")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/families")
    public ResponseEntity<List<CatalogFamilyResponse>> listFamilies() {
        return ResponseEntity.ok(catalogService.listFamilies());
    }

    @GetMapping("/children")
    public ResponseEntity<List<CatalogFamilyChildResponse>> listFamilyChildren(@RequestParam UUID familyId) {
        return ResponseEntity.ok(catalogService.listFamilyChildren(familyId));
    }

    @GetMapping("/models")
    public ResponseEntity<List<CatalogProductModelResponse>> listModels() {
        return ResponseEntity.ok(catalogService.listModels());
    }

    @GetMapping("/door-products")
    public ResponseEntity<List<CatalogDoorProductResponse>> listDoorProducts(@RequestParam UUID modeloId) {
        return ResponseEntity.ok(catalogService.listDoorProducts(modeloId));
    }

    @GetMapping("/variants")
    public ResponseEntity<List<CatalogProductVariantResponse>> listVariants(@RequestParam UUID puertaId) {
        return ResponseEntity.ok(catalogService.listVariants(puertaId));
    }
}
