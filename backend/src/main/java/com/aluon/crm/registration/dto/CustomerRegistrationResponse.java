package com.aluon.crm.registration.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;
import com.aluon.crm.registration.model.CustomerRegistrationStatus;


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
