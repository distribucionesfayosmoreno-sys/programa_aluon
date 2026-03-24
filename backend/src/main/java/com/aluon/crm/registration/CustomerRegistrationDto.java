package com.aluon.crm.registration;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Builder
public class CustomerRegistrationDto {
    private UUID id;
    private String nombreComercial;
    private String razonSocial;
    private String personaContacto;
    private String email;
    private String telefonoWhatsapp;
    private String direccion;
    private String cp;
    private String poblacion;
    private String provincia;
    private String pais;
    private CustomerRegistrationStatus status;
    private String tariffCode;
    private UUID customerId;
    private boolean autoApproveQuotes;
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;
}
