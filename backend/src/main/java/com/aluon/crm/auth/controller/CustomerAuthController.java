package com.aluon.crm.auth.controller;

import com.aluon.crm.auth.dto.CustomerLoginRequest;
import com.aluon.crm.auth.dto.CustomerLoginResponse;
import com.aluon.crm.auth.service.CustomerAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class CustomerAuthController {

    private final CustomerAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<CustomerLoginResponse> login(@RequestBody CustomerLoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
