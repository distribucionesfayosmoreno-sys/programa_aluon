package com.aluon.crm.customer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import com.aluon.crm.customer.model.Customer;
import com.aluon.crm.customer.mapper.CustomerMapper;
import com.aluon.crm.customer.dto.CustomerRequest;
import com.aluon.crm.customer.dto.CustomerResponse;
import com.aluon.crm.customer.service.CustomerService;


@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final CustomerMapper customerMapper;

    @GetMapping
    public List<CustomerResponse> getAll() {
        return customerService.findAll().stream()
                .map(customerMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(@PathVariable UUID id) {
        Customer customer = customerService.findById(id);
        return ResponseEntity.ok(customerMapper.toResponse(customer));
    }

    @PostMapping
    public CustomerResponse create(@RequestBody CustomerRequest request) {
        Customer created = customerService.save(customerMapper.toEntity(request, null), request.password());
        return customerMapper.toResponse(created);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable UUID id, @RequestBody CustomerRequest request) {
        Customer updated = customerService.save(customerMapper.toEntity(request, id), request.password());
        return customerMapper.toResponse(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        customerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
