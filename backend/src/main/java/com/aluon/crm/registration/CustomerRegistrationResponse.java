package com.aluon.crm.registration;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class CustomerRegistrationResponse {
    private UUID registrationId;
    private UUID customerId;
    private String nombreComercial;
    private String email;
    private String telefonoWhatsapp;
    private CustomerRegistrationStatus status;
    private LocalDateTime createdAt;
}
