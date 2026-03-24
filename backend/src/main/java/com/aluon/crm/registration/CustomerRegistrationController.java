package com.aluon.crm.registration;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class CustomerRegistrationController {

    private final CustomerRegistrationService registrationService;

    @PostMapping
    public ResponseEntity<CustomerRegistrationResponse> register(@RequestBody CustomerRegistrationRequest request) {
        return ResponseEntity.ok(registrationService.register(request));
    }
}
