package com.aluon.crm.customer;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

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
        Customer created = customerService.save(customerMapper.toEntity(request, null));
        return customerMapper.toResponse(created);
    }

    @PutMapping("/{id}")
    public CustomerResponse update(@PathVariable UUID id, @RequestBody CustomerRequest request) {
        Customer updated = customerService.save(customerMapper.toEntity(request, id));
        return customerMapper.toResponse(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        customerService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
