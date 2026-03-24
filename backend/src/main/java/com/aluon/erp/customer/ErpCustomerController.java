package com.aluon.erp.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/erp/customers")
@RequiredArgsConstructor
public class ErpCustomerController {

    private final ErpCustomerService erpCustomerService;

    @GetMapping
    public List<ErpCustomerResponse> list() {
        return erpCustomerService.listAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ErpCustomerResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(erpCustomerService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ErpCustomerResponse> create(@RequestBody ErpCustomerCreateRequest request) {
        return ResponseEntity.ok(erpCustomerService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ErpCustomerResponse> update(@PathVariable UUID id, @RequestBody ErpCustomerCreateRequest request) {
        return ResponseEntity.ok(erpCustomerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        erpCustomerService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
