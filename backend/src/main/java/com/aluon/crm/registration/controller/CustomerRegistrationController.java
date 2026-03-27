package com.aluon.crm.registration.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import com.aluon.crm.registration.dto.CustomerRegistrationApprovalRequest;
import com.aluon.crm.registration.dto.CustomerRegistrationDto;
import com.aluon.crm.registration.dto.CustomerRegistrationRejectionRequest;
import com.aluon.crm.registration.dto.CustomerRegistrationRequest;
import com.aluon.crm.registration.dto.CustomerRegistrationResponse;
import com.aluon.crm.registration.service.CustomerRegistrationService;


@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class CustomerRegistrationController {

    private final CustomerRegistrationService registrationService;

    @PostMapping
    public ResponseEntity<CustomerRegistrationResponse> register(@RequestBody CustomerRegistrationRequest request) {
        return ResponseEntity.ok(registrationService.register(request));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CustomerRegistrationDto>> listPending() {
        return ResponseEntity.ok(registrationService.listPending());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerRegistrationResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(registrationService.getResponseById(id));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<CustomerRegistrationDto> approve(@PathVariable UUID id,
                                                           @RequestBody(required = false) CustomerRegistrationApprovalRequest request) {
        return ResponseEntity.ok(registrationService.approve(id, request));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<CustomerRegistrationDto> reject(@PathVariable UUID id,
                                                          @RequestBody(required = false) CustomerRegistrationRejectionRequest request) {
        return ResponseEntity.ok(registrationService.reject(id, request));
    }
}
