package com.aluon.crm.auth.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.UUID;
import com.aluon.crm.registration.model.CustomerRegistrationStatus;

@Getter
@Builder
public class CustomerLoginResponse {
    private UUID registrationId;
    private UUID customerId;
    private String nombreComercial;
    private String email;
    private String telefonoWhatsapp;
    private CustomerRegistrationStatus status;
}
