package com.aluon.crm.registration.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.TenantId;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customer_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private UUID tenantId;

    @Column(name = "nombre_comercial", nullable = false)
    private String nombreComercial;

    @Column(name = "razon_social")
    private String razonSocial;

    @Column(name = "persona_contacto")
    private String personaContacto;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "telefono_whatsapp", nullable = false)
    private String telefonoWhatsapp;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "cp")
    private String cp;

    @Column(name = "poblacion")
    private String poblacion;

    @Column(name = "provincia")
    private String provincia;

    @Column(name = "pais")
    private String pais;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private CustomerRegistrationStatus status;

    @Column(name = "tariff_code")
    private String tariffCode;

    @Column(name = "customer_id")
    private UUID customerId;

    @Column(name = "auto_approve_quotes", nullable = false)
    private boolean autoApproveQuotes;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
}
